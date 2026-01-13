package com.athixwear.service;

import com.athixwear.dto.CheckoutRequest;
import com.athixwear.entity.*;
import com.athixwear.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class OrderService {
    
    private final CartService cartService;
    private final UserService userService;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final AddressRepository addressRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    
    public OrderService(CartService cartService, UserService userService,
                       OrderRepository orderRepository, OrderItemRepository orderItemRepository,
                       AddressRepository addressRepository, CartItemRepository cartItemRepository,
                       ProductRepository productRepository) {
        this.cartService = cartService;
        this.userService = userService;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.addressRepository = addressRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
    }
    
    @Transactional
    public Order createOrder(CheckoutRequest request) {
        User user = userService.getCurrentUser();
        
        // Get user's cart items
        List<CartItem> cartItems = cartItemRepository.findByCart(
            cartService.getOrCreateCart(user)
        );
        
        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }
        
        // Calculate total
        BigDecimal totalAmount = cartItems.stream()
                .map(item -> item.getProduct().getPrice()
                        .multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // Add shipping if needed
        if (totalAmount.compareTo(BigDecimal.valueOf(1000)) < 0) {
            totalAmount = totalAmount.add(BigDecimal.valueOf(50)); // Shipping charge
        }
        
        // Get address
        Address address = addressRepository.findById(request.getAddressId())
                .orElseThrow(() -> new RuntimeException("Address not found"));
        
        // Verify address belongs to user
        if (!address.getUser().getUserId().equals(user.getUserId())) {
            throw new RuntimeException("Invalid address");
        }
        
        // Create order
        Order order = new Order();
        order.setUser(user);
        order.setTotalAmount(totalAmount);
        order.setAddress(address);
        order.setOrderStatus(OrderStatus.PENDING);
        order.setPaymentStatus(PaymentStatus.PENDING);
        order.setOrderDate(LocalDateTime.now());
        
        Order savedOrder = orderRepository.save(order);
        
        // Create order items and update product stock
        for (CartItem cartItem : cartItems) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(savedOrder);
            orderItem.setProduct(cartItem.getProduct());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(cartItem.getProduct().getPrice());
            orderItem.setTotalPrice(
                cartItem.getProduct().getPrice()
                    .multiply(BigDecimal.valueOf(cartItem.getQuantity()))
            );
            orderItemRepository.save(orderItem);
            
            // Update product stock
            Product product = cartItem.getProduct();
            product.setStock(product.getStock() - cartItem.getQuantity());
            productRepository.save(product);
        }
        
        // Clear cart after order
        cartService.clearCart();
        
        return savedOrder;
    }
    
    public List<Order> getUserOrders() {
        User user = userService.getCurrentUser();
        return orderRepository.findByUserUserId(user.getUserId());
    }
    
    public Order getOrderById(Long orderId) {
        User user = userService.getCurrentUser();
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        
        // Verify order belongs to user
        if (!order.getUser().getUserId().equals(user.getUserId())) {
            throw new RuntimeException("Not authorized to view this order");
        }
        
        return order;
    }
}