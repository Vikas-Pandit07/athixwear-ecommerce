package com.athixwear.service;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.athixwear.dto.PaymentOrderRequest;
import com.athixwear.dto.PaymentOrderResponse;
import com.athixwear.dto.PaymentVerifyRequest;
import com.athixwear.dto.PaymentVerifyResponse;
import com.athixwear.entity.Order;
import com.athixwear.entity.OrderStatus;
import com.athixwear.entity.PaymentStatus;
import com.athixwear.entity.User;
import com.athixwear.exception.InvalidCredentialsException;
import com.athixwear.exception.PaymentGatewayException;
import com.athixwear.exception.ResourceNotFoundException;
import com.athixwear.repository.OrderRepository;
import com.razorpay.RazorpayClient;

@Service
public class PaymentService {

    private final OrderRepository orderRepository;
    private final RazorpayClient razorpayClient;
    private final UserService userService;

    public PaymentService(OrderRepository orderRepository, RazorpayClient razorpayClient, UserService userService) {
        this.orderRepository = orderRepository;
        this.razorpayClient = razorpayClient;
        this.userService = userService;
    }

    @Value("${razorpay.key-id}")
    private String razorpayKeyId;

    @Value("${razorpay.key-secret}")
    private String razorpayKeySecret;

    @Transactional
    public PaymentOrderResponse createPaymentOrder(PaymentOrderRequest request) {
        User user = userService.getCurrentUser();

        Order order = orderRepository.findByOrderIdAndUserUserId(request.getOrderId(), user.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (order.getPaymentStatus() == PaymentStatus.PAID) {
            throw new InvalidCredentialsException("Order already paid");
        }

        long amountInPaise = order.getTotalAmount()
                .multiply(BigDecimal.valueOf(100))
                .longValueExact();

        JSONObject options = new JSONObject();
        options.put("amount", amountInPaise);
        options.put("currency", "INR");
        options.put("receipt", "order_" + order.getOrderId());
        options.put("payment_capture", 1);

        try {
            com.razorpay.Order razorpayOrder = razorpayClient.orders.create(options);
            String razorpayOrderId = razorpayOrder.get("id");

            order.setRazorpayOrderId(razorpayOrderId);
            orderRepository.save(order);

            PaymentOrderResponse response = new PaymentOrderResponse();
            response.setKeyId(razorpayKeyId);
            response.setInternalOrderId(order.getOrderId());
            response.setRazorpayOrderId(razorpayOrderId);
            response.setAmount(amountInPaise);
            response.setCurrency("INR");
            return response;
        } catch (Exception e) {
            throw new PaymentGatewayException("Failed to create Razorpay order", e);
        }
    }

    @Transactional
    public PaymentVerifyResponse verifyPayment(PaymentVerifyRequest request) {
        User user = userService.getCurrentUser();

        Order order = orderRepository.findByOrderIdAndUserUserId(request.getInternalOrderId(), user.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (order.getPaymentStatus() == PaymentStatus.PAID) {
            PaymentVerifyResponse alreadyPaid = new PaymentVerifyResponse();
            alreadyPaid.setVerified(true);
            alreadyPaid.setMessage("Payment already verified");
            alreadyPaid.setOrderId(order.getOrderId());
            alreadyPaid.setPaymentStatus(order.getPaymentStatus());
            alreadyPaid.setOrderStatus(order.getOrderStatus());
            return alreadyPaid;
        }

        if (order.getRazorpayOrderId() == null || !order.getRazorpayOrderId().equals(request.getRazorpayOrderId())) {
            throw new InvalidCredentialsException("Invalid Razorpay order id");
        }

        String payload = request.getRazorpayOrderId() + "|" + request.getRazorpayPaymentId();
        String expectedSignature = generateHmacSha256(payload, razorpayKeySecret);

        if (!constantTimeEquals(expectedSignature, request.getRazorpaySignature())) {
            order.setPaymentStatus(PaymentStatus.FAILED);
            orderRepository.save(order);
            throw new InvalidCredentialsException("Payment signature verification failed");
        }

        order.setRazorpayPaymentId(request.getRazorpayPaymentId());
        order.setRazorpaySignature(request.getRazorpaySignature());
        order.setPaymentStatus(PaymentStatus.PAID);
        order.setOrderStatus(OrderStatus.CONFIRMED);
        orderRepository.save(order);

        PaymentVerifyResponse response = new PaymentVerifyResponse();
        response.setVerified(true);
        response.setMessage("Payment verified successfully");
        response.setOrderId(order.getOrderId());
        response.setPaymentStatus(order.getPaymentStatus());
        response.setOrderStatus(order.getOrderStatus());
        return response;
    }

    private String generateHmacSha256(String data, String secret) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKeySpec = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(secretKeySpec);
            byte[] hash = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return toHex(hash);
        } catch (Exception e) {
            throw new PaymentGatewayException("Failed to compute signature", e);
        }
    }

    private String toHex(byte[] data) {
        StringBuilder builder = new StringBuilder(data.length * 2);
        for (byte b : data) {
            builder.append(String.format("%02x", b));
        }
        return builder.toString();
    }

    private boolean constantTimeEquals(String a, String b) {
        if (a == null || b == null) {
            return false;
        }
        return MessageDigest.isEqual(a.getBytes(StandardCharsets.UTF_8), b.getBytes(StandardCharsets.UTF_8));
    }
}
