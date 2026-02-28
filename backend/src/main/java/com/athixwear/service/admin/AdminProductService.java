package com.athixwear.service.admin;

import java.util.List;

import org.springframework.stereotype.Service;

import com.athixwear.dto.CreateProductRequest;
import com.athixwear.dto.ProductResponse;
import com.athixwear.entity.Category;
import com.athixwear.entity.Product;
import com.athixwear.entity.ProductImage;
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
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

		Product product = new Product();
		product.setName(request.getName());
		product.setDescription(request.getDescription());
		product.setPrice(request.getPrice());
		product.setStock(request.getStock());
		product.setCategory(category);
		
		Product savedProduct = productRepository.save(product);
		return mapToResponse(savedProduct);
	}
	
	public ProductResponse updateProduct(Integer productId, CreateProductRequest request) {
		Product product = productRepository.findById(productId)
				.orElseThrow(() -> new ResourceNotFoundException("Product not found"));
		
		if (request.getName() != null) product.setName(request.getName());
		if (request.getDescription() != null) product.setDescription(request.getDescription());
		if (request.getPrice() != null) product.setPrice(request.getPrice());
		if (request.getStock() != null) product.setStock(request.getStock());
		if (request.getCategoryId() != null) {
			Category category = categoryRepository.findById(request.getCategoryId())
					.orElseThrow(() -> new ResourceNotFoundException("Categroy not found"));
			product.setCategory(category);
		}
		
		Product savedProduct= productRepository.save(product);
		return mapToResponse(savedProduct);
	}
	
	public void deleteProduct(Integer productId) {
		Product product = productRepository.findById(productId)
				.orElseThrow(() -> new ResourceNotFoundException("Product not found"));
		
		productRepository.delete(product);
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
		return null;
	}
}
