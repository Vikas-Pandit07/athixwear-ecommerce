package com.athixwear.controller;



import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
	
	@GetMapping("/dashboard")
	public ResponseEntity<?> getAdminDashboard() {
		return ResponseEntity.ok().body(Map.of(
			"message", "Welcome to Admin Dashboard",
			"stats", Map.of(
					"totalUsers", 150,
					"totalOrders", 1200,
					"totolRevenue", 50000,
					"pendingOrders", 45
			)
		));
	}
	
	@GetMapping("/users")
	public ResponseEntity<?> getAllUsers() {
		// fetch user from database
		return ResponseEntity.ok().body(Map.of(
			"users", new String[] {"user1", "user2", "user3"}
		));
	}
	
}
