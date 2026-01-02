package com.athixwear.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.athixwear.entity.Cart;

@Repository
public interface CartItemRepository extends JpaRepository<Cart, Integer> {
	
	@Query("SELECT COALESCE(SUM(ci.quantity), 0) FROM CartItem ci WHERE ci.cart.cartId = :cartId")
	int getTotalItemCount(int cartId);
}