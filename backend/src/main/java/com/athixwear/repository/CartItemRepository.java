package com.athixwear.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.athixwear.entity.Cart;
import com.athixwear.entity.CartItem;
import com.athixwear.entity.Product;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Integer> {
	
	// Get total item count for a cart
	@Query("SELECT COALESCE(SUM(ci.quantity), 0) FROM CartItem ci WHERE ci.cart.cartId = :cartId")
	int getTotalItemCount(int cartId);
	
	// Find all items in cart
	List<CartItem> findByCart(Cart cart);
	
	// Find specific item by cart and product
	Optional<CartItem> findByCartAndProduct(Cart cart, Product product);
	
	// Delete all item from cart
	void deleteByCart(Cart cart);
}
