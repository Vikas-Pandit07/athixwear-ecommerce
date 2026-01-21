package com.athixwear.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.athixwear.dto.AddToCartRequest;
import com.athixwear.dto.CartItemResponse;
import com.athixwear.entity.Cart;
import com.athixwear.entity.CartItem;
import com.athixwear.entity.Product;
import com.athixwear.entity.ProductImage;
import com.athixwear.entity.User;
import com.athixwear.exception.ResourceNotFoundException;
import com.athixwear.repository.CartItemRepository;
import com.athixwear.repository.CartRepository;
import com.athixwear.repository.ProductImageRepository;
import com.athixwear.repository.ProductRepository;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserService userService;
    private final ProductImageRepository productImageRepository;

    public CartService(CartRepository cartRepository, CartItemRepository cartItemRepository,
            ProductRepository productRepository, UserService userService,
            ProductImageRepository productImageRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.userService = userService;
        this.productImageRepository = productImageRepository;
    }

    // Get current authenticated user
    private User getCurrentUser() {
        return userService.getCurrentUser();
    }
    
    // get or create cart for user
    public Cart getOrCreateCart(User user) {
        Cart cart = cartRepository.findByUser_UserId(user.getUserId());
        if (cart == null) {
            cart = new Cart();
            cart.setUser(user);
            cart = cartRepository.save(cart);
        }
        return cart;
    }
    
    // add product to cart
    @Transactional
    public void addToCart(AddToCartRequest request) {
        User user = getCurrentUser();
        Cart cart = getOrCreateCart(user);
        
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        
        // check stock availability
        if (product.getStock() <= 0) {
        	throw new RuntimeException("Product '" + product.getName() + "' is out of stock");
        }
        
        // check if requested quantity available in stock
        Optional<CartItem> existingItem = cartItemRepository.findByCartAndProduct(cart, product);
        int currentQuantity = existingItem.map(CartItem::getQuantity).orElse(0);
        int requestedQuantity = request.getQuantity() != null ? request.getQuantity() : 1;
        
        if (currentQuantity + requestedQuantity > product.getStock()) {
        	throw new RuntimeException("Requeste quantity exceeds available stock. A available: " + product.getStock() + " for product: " + product.getName());
        }
        
        // check if product already in cart    
        if (existingItem.isPresent()) {
            // update quantity if item already exists
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + requestedQuantity);
            cartItemRepository.save(item);        
        } else {
            // add new item to cart
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setProduct(product);
            newItem.setQuantity(request.getQuantity());
            cartItemRepository.save(newItem);
        }
    }
    
    // get all cart items for user
    public List<CartItemResponse> getCartItems() {
        User user = getCurrentUser();
        Cart cart = getOrCreateCart(user);
        
        List<CartItem> cartItems = cartItemRepository.findByCart(cart);
        
        return cartItems.stream()
                .map(this::convertToResponse)
                .toList();
    }
    
    // update item quantity with stock validation
    @Transactional
    public void updateQuantity(Integer cartItemId, Integer quantity) {
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));
        
        // check if item belongs to current user;
        User user = getCurrentUser();
        if (!item.getCart().getUser().getUserId().equals(user.getUserId())) {
                throw new RuntimeException("Not authorized to update this cart item");
        }
        
        // check stock availability  
        if (quantity > item.getProduct().getStock()) {
        	throw new RuntimeException("Requested quantity exceeds available stock. Available: " + item.getProduct().getStock());        	
        }
        
        if (quantity <= 0) {
        	// remove item if quantity is 0 or negative
            cartItemRepository.delete(item);
        } else {
            // update quantity
            item.setQuantity(quantity);
            cartItemRepository.save(item);
        }
    }
    
    // remove item from cart
    @Transactional
    public void removeCartItem(Integer cartItemId) {
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));
        
        // check if item belongs to current user
        User user = getCurrentUser();
        if (!item.getCart().getUser().getUserId().equals(user.getUserId())) {
            throw new RuntimeException("Not authorized to remove this cart item");
        }
        
        cartItemRepository.delete(item);
    }
        
    // get cart item count for badge
    public int getCartItemCount() {
        User user = getCurrentUser();
        Cart cart = cartRepository.findByUser_UserId(user.getUserId());
        
        if (cart == null) {
            return 0;
        }
        
        List<CartItem> cartItems = cartItemRepository.findByCart(cart);
        return cartItems.stream()
                .mapToInt(CartItem::getQuantity)
                .sum();    
    }
    
    private CartItemResponse convertToResponse(CartItem item) {
        CartItemResponse response = new CartItemResponse();
        response.setCartItemId(item.getCartItemId());
        response.setProductId(item.getProduct().getProductId());
        response.setProductName(item.getProduct().getName());
        response.setPrice(item.getProduct().getPrice());
        response.setQuantity(item.getQuantity());
        
        // calculate total price for this item
        BigDecimal totalPrice = item.getProduct().getPrice()
                .multiply(BigDecimal.valueOf(item.getQuantity()));
        
        response.setTotalPrice(totalPrice);
        
        // get first product image
        List<ProductImage> images = productImageRepository.findByProduct_ProductId(item.getProduct().getProductId());
        
        if (!images.isEmpty()) {
            response.setProdctImage(images.get(0).getImageUrl());
        } else {
            // default image if no product image
            response.setProdctImage("https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600");
        }
        
        return response;
    }
    
    // clear full cart
    @Transactional
    public void clearCart() {
        User user = getCurrentUser();
        Cart cart = getOrCreateCart(user);
        
        if (cart != null) {
            List<CartItem> cartItems = cartItemRepository.findByCart(cart);
            cartItemRepository.deleteAll(cartItems);
        }
    }
}