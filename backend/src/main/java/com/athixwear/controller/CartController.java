package com.athixwear.controller;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.athixwear.dto.AddToCartRequest;
import com.athixwear.dto.CartItemResponse;
import com.athixwear.service.CartService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class CartController {
    
    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }
    
    // Add item to cart
    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@Valid @RequestBody AddToCartRequest request) {
        try {
            cartService.addToCart(request);
            return ResponseEntity.ok().body(Map.of(
                "success", true,
                "message", "Product added to cart successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
    
    // Get all cart items
    @GetMapping
    public ResponseEntity<?> getCart() {
        try {
            List<CartItemResponse> items = cartService.getCartItems();
            
            // Calculate totals
            BigDecimal subtotal = items.stream()
                    .map(item -> item.getTotalPrice())
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            
            BigDecimal shipping = subtotal.compareTo(BigDecimal.valueOf(1000)) > 0 
                    ? BigDecimal.ZERO 
                    : BigDecimal.valueOf(50);
            
            BigDecimal total = subtotal.add(shipping);
            
            // Create response map
            Map<String, Object> response = Map.of(
                "success", true,
                "items", items,
                "subtotal", subtotal,
                "shipping", shipping,
                "total", total,
                "itemCount", items.size()
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
    
    // Update item quantity
    @PutMapping("/items/{itemId}")
    public ResponseEntity<?> updateQuantity(
            @PathVariable Integer itemId,
            @RequestParam Integer quantity) {
        try {
            cartService.updateQuantity(itemId, quantity);
            return ResponseEntity.ok().body(Map.of(
                "success", true,
                "message", "Cart updated successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
    
    // Remove item from cart
    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<?> removeItemFromCart(@PathVariable Integer itemId) {
        try {
            cartService.removeCartItem(itemId);
            return ResponseEntity.ok().body(Map.of(
                "success", true,
                "message", "Item removed from cart"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
    
    // Get cart item count for badge
    @GetMapping("/count")
    public ResponseEntity<?> getCartItemCount() {
        try {
            int count = cartService.getCartItemCount();
            return ResponseEntity.ok().body(Map.of(
                "success", true,
                "count", count
            ));
        } catch (Exception e) {
            return ResponseEntity.ok().body(Map.of(
                "success", false,
                "count", 0
            ));
        }
    }
    
    // Clear full cart
    @DeleteMapping("/clear")
    public ResponseEntity<?> clearCart() {
        try {
            cartService.clearCart();
            return ResponseEntity.ok().body(Map.of(
                "success", true,
                "message", "Cart cleared successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
}