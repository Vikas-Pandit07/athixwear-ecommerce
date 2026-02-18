package com.athixwear.service;

import java.math.BigDecimal;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.athixwear.dto.PaymentOrderRequest;
import com.athixwear.dto.PaymentOrderResponse;
import com.athixwear.entity.Order;
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
		super();
		this.orderRepository = orderRepository;
		this.razorpayClient = razorpayClient;
		this.userService = userService;
	}

	@Value("${razorpay.key-id}")
	private String razorpayKeyId;

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
}
