package com.athixwear.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.athixwear.dto.ProductResponse;
import com.athixwear.service.ProductService;
import com.razorpay.RazorpayClient;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final RazorpayClient razorpayClient;
		
	private final ProductService productService;

	public ProductController(ProductService productService, RazorpayClient razorpayClient) {
		this.productService = productService;
		this.razorpayClient = razorpayClient;
	}
	
	@GetMapping
	public ResponseEntity<?> getProductById(@PathVariable Integer productId) {

		return ResponseEntity.ok(productService.getProductById(productId));
	}
	
	@GetMapping
	public ResponseEntity<List<ProductResponse>> getProducts(
			@RequestParam(required = false) String category) {
	
		return ResponseEntity.ok(productService.getProducts(category));
	}
	
}
