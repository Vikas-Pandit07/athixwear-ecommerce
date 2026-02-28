package com.athixwear.controller.admin;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.athixwear.dto.CreateProductRequest;
import com.athixwear.dto.UpdateProductRequest;
import com.athixwear.service.admin.AdminProductService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin/products")
@PreAuthorize("hasRole('ADMIN')")
public class AdminProductController {
	
	private final AdminProductService adminProductService;

	public AdminProductController(AdminProductService adminProductService) {
		super();
		this.adminProductService = adminProductService;
	}
	
	@PostMapping
	public ResponseEntity<?> createProduct(@Valid @RequestBody CreateProductRequest request) {
	
		return ResponseEntity.ok(Map.of("Success", true, "product", adminProductService.createProduct(request)));
	}
	
    @PutMapping("/{productId}")
    public ResponseEntity<?> updateProduct(@PathVariable Integer productId,
    										@RequestBody UpdateProductRequest request) {
    	
        return ResponseEntity.ok(Map.of("success", true, "product", adminProductService.updateProduct(productId, request)));                      
    }
	
	@DeleteMapping("/{productId}")
	public ResponseEntity<?> deleteProduct(@PathVariable Integer productId) {
		adminProductService.deleteProduct(productId);
		return ResponseEntity.ok(Map.of("success", true, "message", "product deleted"));
	}
}
