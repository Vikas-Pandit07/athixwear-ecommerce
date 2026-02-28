package com.athixwear.service.admin;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.athixwear.dto.AddressResponse;
import com.athixwear.dto.OrderItemResponse;
import com.athixwear.dto.admin.AdminOrderResponse;
import com.athixwear.entity.Address;
import com.athixwear.entity.Order;
import com.athixwear.entity.OrderItem;
import com.athixwear.entity.OrderStatus;
import com.athixwear.entity.ProductImage;
import com.athixwear.exception.BadRequestException;
import com.athixwear.exception.ResourceNotFoundException;
import com.athixwear.repository.OrderRepository;
import com.athixwear.repository.ProductImageRepository;

@Service
public class AdminOrderService {

	private final OrderRepository orderRepository;
	private final ProductImageRepository productImageRepository;
	
	public AdminOrderService(OrderRepository orderRepository, ProductImageRepository productImageRepository) {
		super();
		this.orderRepository = orderRepository;
		this.productImageRepository = productImageRepository;
	}
	
	public List<AdminOrderResponse> getAllOrders() {
		return orderRepository.findAll(Sort.by(Sort.Direction.DESC, "orderData"))
				.stream()
				.map(this::mapToResponse)
				.toList();
	}

	@Transactional
    public AdminOrderResponse updateOrderStatus(Integer orderId, String status) {
		 Order order = orderRepository.findById(orderId)
				 .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
		 
		 OrderStatus newStatus;
		 try {
	            newStatus = OrderStatus.valueOf(status.toUpperCase());
	        } catch (IllegalArgumentException e) {
	            throw new BadRequestException("Invalid order status: " + status);
	        }

	      order.setOrderStatus(newStatus);
	      Order saved = orderRepository.save(order);
	      return mapToResponse(saved);
	}
	
	private AdminOrderResponse mapToResponse(Order order) {
		AdminOrderResponse response = new AdminOrderResponse();
		response.setOrderId(order.getOrderId());
        response.setCustomerUsername(order.getUser().getUsername());
        response.setCustomerEmail(order.getUser().getEmail());
        response.setTotalAmount(order.getTotalAmount());
        response.setOrderStatus(order.getOrderStatus().name());
        response.setPaymentStatus(order.getPaymentStatus().name());
        response.setPaymentMethod(order.getPaymentMethod());
        response.setOrderDate(order.getOrderDate());
        
        Address address = order.getAddress();
        AddressResponse addressResponse = new AddressResponse();
        addressResponse.setAddressId(address.getAddressId());
        addressResponse.setFullName(address.getFullName());
        addressResponse.setPhone(address.getPhone());
        addressResponse.setAddressLine(address.getAddressLine());
        addressResponse.setCity(address.getCity());
        addressResponse.setState(address.getState());
        addressResponse.setPinCode(address.getPinCode());
        response.setAddress(addressResponse);
        
        List<OrderItemResponse> items = order.getOrderItems()
                .stream()
                .map(this::mapItemToResponse)
                .toList();
        response.setItems(items);

        return response;
	}
	
	private OrderItemResponse mapItemToResponse(OrderItem item) {
		OrderItemResponse response = new OrderItemResponse();
        response.setOrderItemId(item.getOrderItemId());
        response.setProductId(item.getProduct().getProductId());
        response.setProductName(item.getProduct().getName());
        response.setQuantity(item.getQuantity());
        response.setPrice(item.getPrice());
        response.setTotalPrice(item.getTotalPrice());

        List<ProductImage> images = productImageRepository
                .findByProduct_ProductId(item.getProduct().getProductId());

        if (!images.isEmpty()) {
            response.setProductImage(images.get(0).getImageUrl());
        }

        return response;
	}
}
