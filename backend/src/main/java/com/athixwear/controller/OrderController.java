package com.athixwear.controller;

import com.athixwear.dto.CheckoutRequest;
import com.athixwear.dto.OrderResponse;
import com.athixwear.entity.Order;
import com.athixwear.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    
    private final OrderService orderService;
    
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }
    
    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(@Valid @RequestBody CheckoutRequest request) {
        try {
            OrderResponse order = orderService.createOrder(request);
            return ResponseEntity.ok().body(Map.of(
                "message", "Order placed successfully",
                "orderId", order.getOrderId(),
                "totalAmount", order.getTotalAmount()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping
    public ResponseEntity<?> getUserOrders() {
        try {
            List<OrderResponse> orders = orderService.getUserOrders();
            return ResponseEntity.ok().body(Map.of("orders", orders));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/{orderId}")
    public ResponseEntity<?> getOrderDetails(@PathVariable Integer orderId) {
        try {
            OrderResponse order = orderService.getOrderById(orderId);
            return ResponseEntity.ok().body(Map.of("order", order));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}