package com.athixwear.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.athixwear.entity.Category;

import java.util.List;


@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer>{
	
	Optional<Category>findByCategoryName(String categoryName);
}
