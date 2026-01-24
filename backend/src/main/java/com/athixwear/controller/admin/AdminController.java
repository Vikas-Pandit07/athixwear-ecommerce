package com.athixwear.controller.admin;

import com.athixwear.dto.admin.AdminStatsResponse;
import com.athixwear.entity.User;
import com.athixwear.service.admin.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    
    private final AdminService adminService;
    
    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }
    
    @GetMapping("/stats")
    public ResponseEntity<?> getDashboardStats(@AuthenticationPrincipal User user) {  // Removed @RequestParam Role userRole
        try {
            AdminStatsResponse stats = adminService.getDashboardStats();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Dashboard stats fetched successfully");
            response.put("stats", stats);
            response.put("timestamp", System.currentTimeMillis());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "Failed to fetch dashboard statistics");
            errorResponse.put("message", e.getMessage());
            errorResponse.put("details", e.toString());
            
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
    
    //  Recent orders for dashboard
    @GetMapping("/orders/recent")
    public ResponseEntity<?> getRecentOrders() {
        try {
            Map<String, Object> order1 = Map.of(
                "orderId", 1001,
                "customer", "John Doe",
                "amount", 2500,
                "status", "DELIVERED",
                "date", "2024-01-15"
            );
            
            Map<String, Object> order2 = Map.of(
                    "orderId", 1002,
                    "customer", "Jane Smith",
                    "amount", 1800,
                    "status", "PROCESSING",
                    "date", "2024-01-14"
                );
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("orders", List.of(order1, order2));
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
    
    @GetMapping("/customers/recent")
    public ResponseEntity<?> getRecentCustomers() {
    	try {
            Map<String, Object> customer1 = Map.of(
                "customerId", 101,
                "customer", "John Doe",
                "email", "john@gmail.com",
                "joinDate", "2026-01-25",
                "orders", "5"
            );
            
            Map<String, Object> customer2 = Map.of(
                    "customerId", 102,
                    "name", "Merry Franso",
                    "email", "merry@gmail.com",
                    "joinDate", "2026-01-25",
                    "orderCount", 2
                );
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("orders", List.of(customer1, customer2));
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
    
    @GetMapping("/products/top")
    public ResponseEntity<?> getTopProducts() {
    	try {
            Map<String, Object> product1 = Map.of(
                "product", 10,
                "name", "shoes",
                "sold", 18,
                "revenue", 20000
            );
            
            Map<String, Object> product2 = Map.of(
                    "productId", 102,
                    "name", "Red Snecker",
                    "soldCount", 25,
                    "revenue", 40000
                    
            );
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("products", List.of(product1, product2));
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
}