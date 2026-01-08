package com.athixwear.controller;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.athixwear.dto.AddToCartRequest;
import com.athixwear.dto.CartItemResponse;
import com.athixwear.dto.CartSummaryResponse;
import com.athixwear.service.CartService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/cart")
public class CartController {
	
	private final CartService cartService;

	public CartController(CartService cartService) {
		super();
		this.cartService = cartService;
	}
	
	 // Add item to cart
    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@Valid @RequestBody AddToCartRequest request) {
        try {
            cartService.addToCart(request);
            return ResponseEntity.ok().body(Map.of(
                "message", "Product added to cart",
                "success", true
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", e.getMessage(),
                "success", false
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
                    : BigDecimal.valueOf(50); // Free shipping above ₹1000
            
            BigDecimal total = subtotal.add(shipping);
            
            CartSummaryResponse response = new CartSummaryResponse();
            response.setItems(items);
            response.setSubtotal(subtotal);
            response.setShipping(shipping);
            response.setTotal(total);
            response.setItemCount(items.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
	
	 // Update item quantity
    @PutMapping("/items/{itemId}")
    public ResponseEntity<?> updateQuantity(
            @PathVariable Integer itemId,
            @RequestParam Integer quantity) {
        try {
            cartService.updateQuantity(itemId, quantity);
            return ResponseEntity.ok().body(Map.of("message", "Cart updated"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
	
	// remove item from cart
	@DeleteMapping("/item/{itemId}")
	public ResponseEntity<?> removeItemFromCart(@PathVariable Integer itemId) {
		try {
			cartService.removeCartItem(itemId);
			return ResponseEntity.ok().body(Map.of("message", "Item removed from cart"));
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
		}
	}
	
	// get cart item count for badge
	@GetMapping("/count")
	public ResponseEntity<?> getCartItemCount() {
		try {
			int count = cartService.getCartItemCount();
			return ResponseEntity.ok().body(Map.of("count", count));
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(Map.of("count", 0));
		}
	}
	
	
	// clear full cart
	@DeleteMapping("/clear")
	public ResponseEntity<?> clearCart() {
		try {
			cartService.clearCart();
			return ResponseEntity.ok().body(Map.of("message", "Cart Cleared"));
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
		}
	}
}
