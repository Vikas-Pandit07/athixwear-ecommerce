package com.athixwear.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.athixwear.service.CartItemService;

@RestController
@RequestMapping("/api/cart")
public class CartItemController {
	
	private final CartItemService service;

	public CartItemController(CartItemService service) {
		super();
		this.service = service;
	}
	
	@GetMapping("/item/count")
	public ResponseEntity<?> getCartItemCount(
			@RequestParam int userId) {
		
		int count = service.getCartItemCount(userId);
		return ResponseEntity.ok(count);
	}

}
