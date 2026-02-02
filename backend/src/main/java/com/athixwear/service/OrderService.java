package com.athixwear.service;

import com.athixwear.dto.AddressResponse;
import com.athixwear.dto.CheckoutRequest;
import com.athixwear.dto.CheckoutResponse;
import com.athixwear.dto.OrderItemResponse;
import com.athixwear.dto.OrderResponse;
import com.athixwear.entity.*;
import com.athixwear.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class OrderService {
    
    private final CartService cartService;
    private final UserService userService;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final AddressRepository addressRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;
    
    public OrderService(CartService cartService, UserService userService, OrderRepository orderRepository,
			OrderItemRepository orderItemRepository, AddressRepository addressRepository,
			CartItemRepository cartItemRepository, ProductRepository productRepository,
			ProductImageRepository productImageRepository) {
		super();
		this.cartService = cartService;
		this.userService = userService;
		this.orderRepository = orderRepository;
		this.orderItemRepository = orderItemRepository;
		this.addressRepository = addressRepository;
		this.cartItemRepository = cartItemRepository;
		this.productRepository = productRepository;
		this.productImageRepository = productImageRepository;
	}
    
    @Transactional
    public CheckoutResponse createOrder(CheckoutRequest request) {
        User user = userService.getCurrentUser();
        
        // Get user's cart items
        Cart cart = cartService.getOrCreateCart(user);
        List<CartItem> cartItems = cartItemRepository.findByCart(cart);
        
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
        
        // Create order
        Order order = new Order();
        order.setUser(user);
        order.setTotalAmount(totalAmount);
        order.setAddress(address);
        order.setOrderStatus(OrderStatus.PENDING);
        order.setPaymentStatus(PaymentStatus.PENDING);
        order.setPaymentMethod(request.getPaymentMethod());
        order.setOrderDate(LocalDateTime.now());
        
        Order savedOrder = orderRepository.save(order);
        
        // Create order items and update product stock
        for (CartItem cartItem : cartItems) {
        	
        	if (cartItem.getQuantity() > cartItem.getProduct().getStock()) {
                throw new RuntimeException(
                        "Insufficient stock for " + cartItem.getProduct().getName()
                );
            }
        	
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
            int newStock = product.getStock() - cartItem.getQuantity();
            product.setStock(newStock);
            productRepository.save(product);
        }
        
        // Clear cart after order
        cartService.clearCart();
        
        CheckoutResponse response = new CheckoutResponse();
        response.setOrderId(savedOrder.getOrderId());
        response.setOrderStatus(savedOrder.getOrderStatus().name());
        response.setPaymentStatus(savedOrder.getPaymentStatus().name());
        response.setTotalAmount(savedOrder.getTotalAmount());
        response.setMessage("Order placed successfully");

        return response;
    }
    
    public List<OrderResponse> getUserOrders() {
        User user = userService.getCurrentUser();
        List<Order> orders = orderRepository.findByUserUserId(user.getUserId());
        return orders.stream()
                .map(this::getOrderResponse)
                .collect(Collectors.toList());
    }
    
    public OrderResponse getOrderById(Integer orderId) {
        User user = userService.getCurrentUser();
        Order order = orderRepository.findByOrderIdAndUserUserId(orderId, user.getUserId())
                .orElseThrow(() -> new RuntimeException("Order not found"));
        
        return getOrderResponse(order);
    }
    
    private OrderResponse getOrderResponse(Order order) {
    	OrderResponse response = new OrderResponse();
    	 response.setOrderId(order.getOrderId());
         response.setTotalAmount(order.getTotalAmount());
         response.setOrderStatus(order.getOrderStatus().name());
         response.setPaymentStatus(order.getPaymentStatus().name());
         response.setPaymentMethod(order.getPaymentMethod());
         response.setOrderDate(order.getOrderDate());
         
         AddressResponse addressResponse = new AddressResponse();
         Address address = order.getAddress();
         addressResponse.setAddressId(address.getAddressId());
         addressResponse.setFullName(address.getFullName());
         addressResponse.setPhone(address.getPhone());
         addressResponse.setAddressLine(address.getAddressLine());
         addressResponse.setCity(address.getCity());
         addressResponse.setState(address.getState());
         addressResponse.setPinCode(address.getPinCode());
         addressResponse.setCountry(address.getCountry());
         addressResponse.setDefault(address.isDefault());
         response.setShippingAddress(addressResponse);
         
         // Set order items
         List<OrderItem> orderItems = orderItemRepository.findByOrderOrderId(order.getOrderId());
         List<OrderItemResponse> itemResponses = orderItems.stream()
                 .map(this::getOrderItemResponse)
                 .collect(Collectors.toList());
         response.setItems(itemResponses);
         
         return response;
     }
    
    private OrderItemResponse getOrderItemResponse(OrderItem orderItem) {
        OrderItemResponse response = new OrderItemResponse();
        response.setOrderItemId(orderItem.getOrderItemId());
        response.setProductId(orderItem.getProduct().getProductId());
        response.setProductName(orderItem.getProduct().getName());
        response.setQuantity(orderItem.getQuantity());
        response.setPrice(orderItem.getPrice());
        response.setTotalPrice(orderItem.getTotalPrice());
        
        // Get product image
        List<ProductImage> images = productImageRepository
                .findByProduct_ProductId(orderItem.getProduct().getProductId());
        if (!images.isEmpty()) {
            response.setProductImage(images.get(0).getImageUrl());
        }
        
        return response;
    }
}