package com.athixwear.repository;

import com.athixwear.entity.Order;
import com.athixwear.entity.OrderStatus;
import com.athixwear.entity.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    
    // Find all orders for a user
    List<Order> findByUserUserId(Integer userId);
    
 // Find order by ID and user ID (for security)
    Optional<Order> findByOrderIdAndUserUserId(Integer orderId, Integer userId);

    // Find orders within date range
    List<Order> findByOrderDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    
 // Find orders with specific product
    @Query("SELECT DISTINCT o FROM Order o JOIN o.orderItems oi WHERE oi.product.productId = :productId")
    List<Order> findOrdersByProductId(@Param("productId") Integer productId);
    
    // Find recent orders (last 30 days)
    @Query("SELECT o FROM Order o ORDER BY o.orderDate DESC LIMIT 10")
    List<Order> findRecentOrders();
    
    // Count orders by user
    long countByUserUserId(Integer userId);
    
//    count of orders by status
    @Query("SELECT o.orderStatus, COUNT(o) FROM Order o GROUP BY o.orderStatus")
    List<Object[]> getOrderStatistics();
    
    // Calculate total revenue
    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.paymentStatus = 'PAID'")
    BigDecimal getTotalRevenue();
    
    // Find order by Razorpay order ID
    Optional<Order> findByRazorpayOrderId(String razorpayOrderId);
    
    // Find orders by status
    List<Order> findByOrderStatus(OrderStatus status);
    
    // Find orders by payment status
    List<Order> findByPaymentStatus(PaymentStatus status);
}