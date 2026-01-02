package com.athixwear.service;

import org.springframework.stereotype.Service;

import com.athixwear.entity.Cart;
import com.athixwear.repository.CartItemRepository;
import com.athixwear.repository.CartRepository;

@Service
public class CartItemService {
	
	private final CartItemRepository cartItemRepository;
	private final CartRepository cartRepository;

	public CartItemService(CartItemRepository cartItemRepository,
			CartRepository cartRepository) {
		super();
		this.cartItemRepository = cartItemRepository;
		this.cartRepository = cartRepository;
	}


	public int getCartItemCount(int userId) {
		
		Cart cart = cartRepository.findByUser_UserId(userId);
		
		if (cart == null) {
			return 0;
		}
		
		return cartItemRepository.getTotalItemCount(cart.getCartId());	
	}

}
