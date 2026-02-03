package com.athixwear.controller;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.athixwear.dto.AddToCartRequest;
import com.athixwear.dto.CartItemResponse;
import com.athixwear.dto.UpdateCartItemRequest;
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
    @PostMapping("/items")
    public ResponseEntity<?> addToCart(@Valid @RequestBody AddToCartRequest request) {
    	   cartService.addToCart(request);
           return ResponseEntity.ok(Map.of("success", true));
    }
    
    // Get all cart items
    @GetMapping
    public ResponseEntity<?> getCart() {
    	 List<CartItemResponse> items = cartService.getCartItems();

         BigDecimal subtotal = items.stream()
                 .map(CartItemResponse::getTotalPrice)
                 .reduce(BigDecimal.ZERO, BigDecimal::add);

         BigDecimal shipping = subtotal.compareTo(BigDecimal.valueOf(1000)) > 0
                 ? BigDecimal.ZERO : BigDecimal.valueOf(50);

         return ResponseEntity.ok(Map.of(
                 "success", true,
                 "items", items,
                 "subtotal", subtotal,
                 "shipping", shipping,
                 "total", subtotal.add(shipping)
         ));
    }
    
    // Update item quantity
    @PutMapping("/items/{itemId}")
    public ResponseEntity<?> updateQuantity(
            @PathVariable Integer itemId,
            @Valid @RequestBody UpdateCartItemRequest request) {
    	cartService.updateQuantity(itemId, request.getQuantity());
        return ResponseEntity.ok(Map.of("success", true));
    }
    
    // Remove item from cart
    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<?> removeItemFromCart(@PathVariable Integer itemId) {
    	 cartService.removeCartItem(itemId);
         return ResponseEntity.ok(Map.of("success", true));
    }
    
    // Get cart item count for badge
    @GetMapping("/count")
    public ResponseEntity<?> getCartItemCount() {
        
            int count = cartService.getCartItemCount();
            return ResponseEntity.ok(Map.of(
                "success", true,
                "count", count
            ));
    }
    
    // Clear cart
    @DeleteMapping()
    public ResponseEntity<?> clearCart() {
    	 cartService.clearCart();
         return ResponseEntity.ok(Map.of("success", true));
    }
}