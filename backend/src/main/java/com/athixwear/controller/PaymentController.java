package com.athixwear.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.athixwear.dto.PaymentOrderRequest;
import com.athixwear.dto.PaymentOrderResponse;
import com.athixwear.dto.PaymentVerifyRequest;
import com.athixwear.dto.PaymentVerifyResponse;
import com.athixwear.service.PaymentService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/create-order")
    public ResponseEntity<PaymentOrderResponse> createPaymentOrder(
            @Valid @RequestBody PaymentOrderRequest request) {
        return ResponseEntity.ok(paymentService.createPaymentOrder(request));
    }
    
    @PostMapping("/verify")
    public ResponseEntity<PaymentVerifyResponse> verifyPayment(@Valid @RequestBody PaymentVerifyRequest request) {
    	return ResponseEntity.ok(paymentService.verifyPayment(request));
    }
}
