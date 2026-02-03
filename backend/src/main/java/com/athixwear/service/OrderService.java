package com.athixwear.service;

import com.athixwear.dto.*;
import com.athixwear.entity.*;
import com.athixwear.exception.InvalidCredentialsException;
import com.athixwear.exception.ResourceNotFoundException;
import com.athixwear.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private static final BigDecimal FREE_SHIPPING_LIMIT = BigDecimal.valueOf(1000);
    private static final BigDecimal SHIPPING_CHARGE = BigDecimal.valueOf(50);

    private final CartService cartService;
    private final UserService userService;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final AddressRepository addressRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;

    public OrderService(
            CartService cartService,
            UserService userService,
            OrderRepository orderRepository,
            OrderItemRepository orderItemRepository,
            AddressRepository addressRepository,
            CartItemRepository cartItemRepository,
            ProductRepository productRepository,
            ProductImageRepository productImageRepository
    ) {
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

        Cart cart = cartService.getOrCreateCart(user);
        List<CartItem> cartItems = cartItemRepository.findByCart(cart);

        if (cartItems.isEmpty()) {
            throw new InvalidCredentialsException("Cart is empty");
        }

        // Calculate total amount
        BigDecimal totalAmount = cartItems.stream()
                .map(item ->
                        item.getProduct().getPrice()
                                .multiply(BigDecimal.valueOf(item.getQuantity()))
                )
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Apply shipping charge if required
        if (totalAmount.compareTo(FREE_SHIPPING_LIMIT) < 0) {
            totalAmount = totalAmount.add(SHIPPING_CHARGE);
        }

        // Validate address ownership
        Address address = addressRepository.findById(request.getAddressId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Address not found"));

        if (!address.getUser().getUserId().equals(user.getUserId())) {
            throw new InvalidCredentialsException("Address does not belong to user");
        }

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

        // Create order items & update stock
        for (CartItem cartItem : cartItems) {

            Product product = cartItem.getProduct();

            if (cartItem.getQuantity() > product.getStock()) {
                throw new InvalidCredentialsException(
                        "Insufficient stock for product: " + product.getName()
                );
            }

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(savedOrder);
            orderItem.setProduct(product);
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(product.getPrice());
            orderItem.setTotalPrice(
                    product.getPrice()
                            .multiply(BigDecimal.valueOf(cartItem.getQuantity()))
            );

            orderItemRepository.save(orderItem);

            // Update product stock
            product.setStock(product.getStock() - cartItem.getQuantity());
            productRepository.save(product);
        }

        // Clear cart after successful order
        cartService.clearCart();

        CheckoutResponse response = new CheckoutResponse();
        response.setOrderId(savedOrder.getOrderId());
        response.setTotalAmount(savedOrder.getTotalAmount());
        response.setOrderStatus(savedOrder.getOrderStatus().name());
        response.setPaymentStatus(savedOrder.getPaymentStatus().name());

        return response;
    }

    public List<OrderResponse> getUserOrders() {

        User user = userService.getCurrentUser();

        return orderRepository.findByUserUserId(user.getUserId())
                .stream()
                .map(this::buildOrderResponse)
                .toList();
    }

    public OrderResponse getOrderById(Integer orderId) {

        User user = userService.getCurrentUser();

        Order order = orderRepository
                .findByOrderIdAndUserUserId(orderId, user.getUserId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Order not found"));

        return buildOrderResponse(order);
    }

    private OrderResponse buildOrderResponse(Order order) {

        OrderResponse response = new OrderResponse();
        response.setOrderId(order.getOrderId());
        response.setTotalAmount(order.getTotalAmount());
        response.setOrderStatus(order.getOrderStatus().name());
        response.setPaymentStatus(order.getPaymentStatus().name());
        response.setPaymentMethod(order.getPaymentMethod());
        response.setOrderDate(order.getOrderDate());

        // Address mapping
        Address address = order.getAddress();
        AddressResponse addressResponse = new AddressResponse();
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

        List<OrderItemResponse> items = orderItemRepository
                .findByOrderOrderId(order.getOrderId())
                .stream()
                .map(this::buildOrderItemResponse)
                .toList();

        response.setItems(items);
        return response;
    }

    private OrderItemResponse buildOrderItemResponse(OrderItem orderItem) {

        OrderItemResponse response = new OrderItemResponse();
        response.setOrderItemId(orderItem.getOrderItemId());
        response.setProductId(orderItem.getProduct().getProductId());
        response.setProductName(orderItem.getProduct().getName());
        response.setQuantity(orderItem.getQuantity());
        response.setPrice(orderItem.getPrice());
        response.setTotalPrice(orderItem.getTotalPrice());

        List<ProductImage> images =
                productImageRepository.findByProduct_ProductId(
                        orderItem.getProduct().getProductId()
                );

        if (!images.isEmpty()) {
            response.setProductImage(images.get(0).getImageUrl());
        }

        return response;
    }
}
