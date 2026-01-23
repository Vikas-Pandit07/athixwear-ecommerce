package com.athixwear.service.admin;

import java.math.BigDecimal;
import java.util.List;

import org.eclipse.angus.mail.handlers.message_rfc822;
import org.springframework.stereotype.Service;
import com.athixwear.controller.AddressController;
import com.athixwear.dto.admin.AdminStatsResponse;
import com.athixwear.repository.OrderItemRepository;
import com.athixwear.repository.OrderRepository;
import com.athixwear.repository.ProductRepository;
import com.athixwear.repository.UserRepository;

@Service
public class AdminService {

    private final AddressController addressController;
	
	private final OrderRepository orderRepository;
	private final UserRepository userRepository;
	private final ProductRepository productRepository;
	private OrderItemRepository orderItemRepository;
	
	public AdminService(OrderRepository orderRepository, UserRepository userRepository,
			ProductRepository productRepository, OrderItemRepository orderItemRepository, AddressController addressController) {
		super();
		this.orderRepository = orderRepository;
		this.userRepository = userRepository;
		this.productRepository = productRepository;
		this.orderItemRepository = orderItemRepository;
		this.addressController = addressController;
	}
	
	public AdminStatsResponse getDashboardStats() {
		AdminStatsResponse response = new AdminStatsResponse();
		
            // 1. BASIC COUNTS
            Long customerCount = userRepository.countByRole("CUSTOMER");
            response.setTotalCustomers(customerCount);
            
            Long productCount = productRepository.count();
            response.setTotalProducts(productCount);
            
            // 2. ORDER STATISTICS
            List<Object[]> orderStats = orderRepository.getOrderStatistics();
            
            for (Object[] stat : orderStats) {
            	String status = (String) stat[0];
            	Long count = (Long) stat[1];
            	
            	switch (status) {
            	 case "PENDING":
                     response.setPendingOrders(count.longValue());
                     break;
                 case "PROCESSING":
                     response.setProcessingOrders(count.longValue());
                     break;
                 case "DELIVERED":
                     response.setDeliveredOrders(count.longValue());
                     break;
                 case "CANCELLED":
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
            response.setTotalRevenue(totalRevenue);
            
            // Average Order Value = Total Revenue / Total Orders
            if (response.getTotalOrders() > 0) {
                BigDecimal avgValue = totalRevenue.divide(
                    BigDecimal.valueOf(response.getTotalOrders()), 
                    2, 
                    BigDecimal.ROUND_HALF_UP
                );
                response.setAverageOrderValue(avgValue);
            }
            
            // 4. CONVERSION RATE
            if (response.getTotalCustomers() > 0) {
            	double conversion = (response.getTotalOrders() * 100.0) / response.getTotalCustomers();
            	response.setConversionRate(Math.min(conversion, 100.0));
            }
            
            // 5. MONTHLY REVENUE DATA
            response.setMonthlyRevenue(getMonthlyRevenueData());
            
            // 6. RECENT ORDERS
            response.setRecentOrders(getRecentOrders());
            
            // 7. TOP PRODUCTS
            response.setTopProducts(getTopProducts());
            
            // 8. RECENT CUSTOMERS
            response.setRecentCustomers(getRecentCustomers());
        
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
