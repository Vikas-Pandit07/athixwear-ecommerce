package com.athixwear.service.admin;

import java.math.BigDecimal;
import java.util.List;

import org.eclipse.angus.mail.handlers.message_rfc822;
import org.springframework.stereotype.Service;
import com.athixwear.controller.AddressController;
import com.athixwear.dto.admin.AdminStatsResponse;
import com.athixwear.entity.OrderStatus;
import com.athixwear.entity.Role;
import com.athixwear.repository.OrderItemRepository;
import com.athixwear.repository.OrderRepository;
import com.athixwear.repository.ProductRepository;
import com.athixwear.repository.UserRepository;

@Service
public class AdminService {

	private final OrderRepository orderRepository;
	private final UserRepository userRepository;
	private final ProductRepository productRepository;
	private final OrderItemRepository orderItemRepository;
	
	public AdminService(OrderRepository orderRepository, UserRepository userRepository,
			ProductRepository productRepository, OrderItemRepository orderItemRepository) {
		super();
		this.orderRepository = orderRepository;
		this.userRepository = userRepository;
		this.productRepository = productRepository;
		this.orderItemRepository = orderItemRepository;
	}
	
	public AdminStatsResponse getDashboardStats() {
		AdminStatsResponse response = new AdminStatsResponse();
		
		try {
            // 1. BASIC COUNTS
            Long customerCount = userRepository.countByRole(Role.CUSTOMER);
            response.setTotalCustomers(customerCount != null ? customerCount : 0L);
            
            Long productCount = productRepository.count();
            response.setTotalProducts(productCount != null ? productCount : 0L);
            
            // 2. ORDER STATISTICS
            List<Object[]> orderStats = orderRepository.getOrderStatistics();
            
            response.setPendingOrders(0L);
            response.setProcessingOrders(0L); // This combines CONFIRMED and SHIPPED
            response.setDeliveredOrders(0L);
            response.setCancelledOrders(0L);
            
            for (Object[] stat : orderStats) {
            	OrderStatus status = (OrderStatus) stat[0];
            	Long count = (Long) stat[1];
            	
            	switch (status) {
            	 case PENDING:
                     response.setPendingOrders(count.longValue());
                     break;
            	 case CONFIRMED:
            	 case SHIPPED:
                     response.setProcessingOrders(response.getProcessingOrders() + count.longValue());
                     break;
                 case DELIVERED:
                     response.setDeliveredOrders(count.longValue());
                     break;
                 case CANCELLED:
                     response.setCancelledOrders(count.longValue());
                     break;
            }
           }
            
            response.setTotalOrders(
                    response.getPendingOrders() + 
                    response.getProcessingOrders() + 
                    response.getDeliveredOrders() + 
                    response.getCancelledOrders()
             );
            
            // 3. REVENUE CALCULATIONS
            BigDecimal totalRevenue = orderRepository.getTotalRevenue();
            response.setTotalRevenue(totalRevenue != null ? totalRevenue : BigDecimal.ZERO);
            
            // Average Order Value = Total Revenue / Total Orders
            if (response.getTotalOrders() > 0) {
            	try {
                    BigDecimal avgValue = response.getTotalRevenue().divide(
                        BigDecimal.valueOf(response.getTotalOrders()), 
                        2, 
                        BigDecimal.ROUND_HALF_UP
                    );
                    response.setAverageOrderValue(avgValue);
                } catch (ArithmeticException e) {
                    response.setAverageOrderValue(BigDecimal.ZERO);
                }
            } else {
                response.setAverageOrderValue(BigDecimal.ZERO);
            }
            
            // 4. CONVERSION RATE
            if (response.getTotalCustomers() > 0) {
            	double conversion = (response.getTotalOrders() * 100.0) / response.getTotalCustomers();
            	response.setConversionRate(Math.min(conversion, 100.0));
            } else {
                response.setConversionRate(0.0);
            }
            
            // 5. MONTHLY REVENUE DATA
            response.setMonthlyRevenue(getMonthlyRevenueData());
            
            // 6. RECENT ORDERS
            response.setRecentOrders(getRecentOrders());
            
            // 7. TOP PRODUCTS
            response.setTopProducts(getTopProducts());
            
            // 8. RECENT CUSTOMERS
            response.setRecentCustomers(getRecentCustomers());
            
			} catch (Exception e) {
                // Log the error and return empty response with safe defaults
                e.printStackTrace();
                // Set all values to 0 to avoid null pointers
                response.setTotalCustomers(0L);
                response.setTotalProducts(0L);
                response.setTotalOrders(0L);
                response.setPendingOrders(0L);
                response.setProcessingOrders(0L);
                response.setDeliveredOrders(0L);
                response.setCancelledOrders(0L);
                response.setTotalRevenue(BigDecimal.ZERO);
                response.setAverageOrderValue(BigDecimal.ZERO);
                response.setConversionRate(0.0);
            }
        return response;
    }
	
	private List<AdminStatsResponse.MonthlyRevenue> getMonthlyRevenueData() {
        // This would query database for last 6 months revenue
        // Simplified for example:
        return List.of(
            createMonthlyRevenue("Jan", 120000),
            createMonthlyRevenue("Feb", 150000),
            createMonthlyRevenue("Mar", 180000),
            createMonthlyRevenue("Apr", 160000),
            createMonthlyRevenue("May", 190000),
            createMonthlyRevenue("Jun", 210000)
        );
    }
	
    private List<AdminStatsResponse.RecentOrder> getRecentOrders() {
        // Query last 10 orders
        // Simplified example:
        return List.of(
            createRecentOrder(1001, "John Doe", 2500, "DELIVERED", "2024-01-15"),
            createRecentOrder(1002, "Jane Smith", 1800, "PROCESSING", "2024-01-14")
           
        );
    }
    
    private List<AdminStatsResponse.TopProduct> getTopProducts() {
        // Simplified example:
        return List.of(
            createTopProduct(101, "White Foxo t-shirt", 56, 23000),
            createTopProduct(102, "Red Snecker", 25, 40000)
        );
    }
    
    private List<AdminStatsResponse.RecentCustomer> getRecentCustomers() {
        // Simplified example:
        return List.of(
            createRecentCustomer(10, "John Doe", "john@gmail.com", "2026-01-25", 3),
            createRecentCustomer(11, "Merry Franso", "merry@gmail.com", "2026-01-25", 2)
        );
    }
    
    private AdminStatsResponse.MonthlyRevenue createMonthlyRevenue(String month, int revenue) {
    	AdminStatsResponse.MonthlyRevenue mr = new AdminStatsResponse.MonthlyRevenue();
    	mr.setMonth(month);
    	mr.setRevenue(BigDecimal.valueOf(revenue));
    	return mr;
    }
	
    private AdminStatsResponse.RecentOrder createRecentOrder(Integer id, String name, 
        int amount, String status, String date) {
    	AdminStatsResponse.RecentOrder ro = new AdminStatsResponse.RecentOrder();
    	ro.setOrderId(id);
		ro.setCustomerName(name);
		ro.setAmount(BigDecimal.valueOf(amount));
		ro.setStatus(status);
		ro.setDate(date);
		return ro;
	 }
    
    private AdminStatsResponse.TopProduct createTopProduct(Integer id, String name, 
            int soldCount, int revenue) {
        	AdminStatsResponse.TopProduct topProduct = new AdminStatsResponse.TopProduct();
        	topProduct.setProductId(id);
        	topProduct.setProductName(name);
        	topProduct.setSoldCount(soldCount);
    		topProduct.setRevenue(BigDecimal.valueOf(revenue));
    		return topProduct;
    }
    
    private AdminStatsResponse.RecentCustomer createRecentCustomer(Integer id, String name, 
             String email, String joinDate, Integer orders) {
        	AdminStatsResponse.RecentCustomer recentCustomer = new AdminStatsResponse.RecentCustomer();
        	recentCustomer.setCustomerId(id);
        	recentCustomer.setName(name);
        	recentCustomer.setEmail(email);
        	recentCustomer.setJoinDate(joinDate);
        	recentCustomer.setOrderCount(orders);
    		return recentCustomer;
    }
}
