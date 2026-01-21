package com.athixwear.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.athixwear.entity.Category;
import com.athixwear.entity.Product;



@Repository
public interface ProductRepository extends JpaRepository<Product, Integer>{
	
	List<Product> findByCategory(Category category);

}

