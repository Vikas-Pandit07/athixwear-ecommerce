package com.athixwear.controller;

import com.athixwear.dto.CheckoutRequest;
import com.athixwear.dto.CheckoutResponse;
import com.athixwear.dto.OrderResponse;
import com.athixwear.service.OrderService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class OrderController {
    
    private final OrderService orderService;
    
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }
    
    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(@Valid @RequestBody CheckoutRequest request) {
    	
    	CheckoutResponse response = orderService.createOrder(request);
    	
    	return ResponseEntity.ok(response);
    }
    
    @GetMapping
    public ResponseEntity<?> getUserOrders() {
        try {
            return ResponseEntity.ok().body(Map.of(
                "success", true,
                "orders", orderService.getUserOrders()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
    
    @GetMapping("/{orderId}")
    public ResponseEntity<?> getOrderById(@PathVariable Integer orderId) {
        try {
            OrderResponse order = orderService.getOrderById(orderId);
            return ResponseEntity.ok().body(Map.of(
                "success", true,
                "order", order
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
}