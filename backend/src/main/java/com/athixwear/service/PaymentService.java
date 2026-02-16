package com.athixwear.service;

import java.security.PrivateKey;

import org.springframework.stereotype.Service;

import com.athixwear.dto.PaymentOrderRequest;
import com.athixwear.dto.PaymentOrderResponse;
import com.athixwear.entity.Order;
import com.athixwear.entity.OrderStatus;
import com.athixwear.entity.PaymentStatus;
import com.athixwear.entity.User;
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

	public PaymentOrderResponse createPaymentOrder(PaymentOrderRequest request) {
		 User user = userService.getCurrentUser();

	     Order order = orderRepository.findByOrderIdAndUserUserId(request.getOrderId(), user.getUserId())
	    		 .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
	     
	     PaymentOrderResponse response = new PaymentOrderResponse();
	     
	     if (order.getPaymentStatus() != PaymentStatus.PAID) {
	     response.setKeyId();
	     response.setInternalOrderId(order.getOrderId());
	     response.setRazorpayOrderId(order.getRazorpayOrderId());
	     response.setAmount(order.getTotalAmount());
	     }
	     
	     orderRepository.save(order);
	     
	     return response;
	}
	
	
}
