package com.athixwear.service.admin;

import org.springframework.stereotype.Service;

import com.athixwear.dto.CreateProductRequest;
import com.athixwear.dto.ProductResponse;
import com.athixwear.entity.Product;
import com.athixwear.exception.ResourceNotFoundException;
import com.athixwear.repository.CategoryRepository;
import com.athixwear.repository.ProductImageRepository;
import com.athixwear.repository.ProductRepository;

@Service
public class AdminProductService {
	
	private final ProductRepository productRepository;
	private final ProductImageRepository productImageRepository;
	private final CategoryRepository categoryRepository;

	public AdminProductService(ProductRepository productRepository,
			ProductImageRepository productImageRepository, CategoryRepository categoryRepository) {
		super();
		this.productRepository = productRepository;
		this.productImageRepository = productImageRepository;
		this.categoryRepository = categoryRepository;
	}

	public ProductResponse createProduct(CreateProductRequest request) {
		
		return null;
		
	}
	
	public ProductResponse updateProduct(CreateProductRequest request) {
		return null;
	}
	
	public void deleteProduct(Integer productId) {
		Product product = productRepository.findById(productId)
				.orElseThrow(() -> new ResourceNotFoundException("Product not found"));
		
		productRepository.delete(product);
	}
}
