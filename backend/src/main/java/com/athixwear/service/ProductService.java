package com.athixwear.service;


import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.athixwear.dto.ProductResponse;
import com.athixwear.entity.Category;
import com.athixwear.entity.Product;
import com.athixwear.entity.ProductImage;
import com.athixwear.repository.CategoryRepository;
import com.athixwear.repository.ProductImageRepository;
import com.athixwear.repository.ProductRepository;

@Service
public class ProductService {
	
	private final ProductRepository productRepository;
	private final ProductImageRepository productImageRepository;
	private final CategoryRepository categoryRepository;
	
	public ProductService(
			ProductRepository productRepository, 
			ProductImageRepository productImageRepository,
			CategoryRepository categoryRepository
	) {
		super();
		this.productRepository = productRepository;
		this.productImageRepository = productImageRepository;
		this.categoryRepository = categoryRepository;
	}
	
	
	public List<ProductResponse> getProducts(String categoryName) {
		
		List<Product> products;
		
	    if (categoryName != null && !categoryName.isEmpty()) {

	        Category category = categoryRepository.findByCategoryName(categoryName)
	                .orElseThrow(() -> new RuntimeException("Category not found"));

	        products = productRepository.findByCategory(category);
	    } else {
	    	products = productRepository.findAll();
	    }
	    
	    return products.stream()
	    		.map(this::mapToResponse)
	    		.toList();
	}

	
	private ProductResponse mapToResponse(Product product) {
		
		List<String> images = productImageRepository
				.findByProduct_ProductId(product.getProductId())
				.stream()
				.map(ProductImage::getImageUrl)
				.toList();
		
		ProductResponse response = new ProductResponse();
		response.setProductId(product.getProductId());
		response.setName(product.getName());
		response.setDescription(product.getDescription());
		response.setPrice(product.getPrice());
		response.setStock(product.getStock());
		response.setCategory(product.getCategory().getCategoryName());
		response.setImages(images);
		
		return response;
	}
	

}

