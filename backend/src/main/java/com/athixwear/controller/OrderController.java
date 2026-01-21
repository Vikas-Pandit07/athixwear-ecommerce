package com.athixwear.controller;

import com.athixwear.dto.CheckoutRequest;
import com.athixwear.dto.OrderResponse;
import com.athixwear.service.OrderService;
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
    public ResponseEntity<?> checkout(@RequestBody CheckoutRequest request) {
        try {
            OrderResponse order = orderService.createOrder(request);
            return ResponseEntity.ok().body(Map.of(
                "success", true,
                "message", "Order placed successfully",
                "orderId", order.getOrderId(),
                "order", order
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
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