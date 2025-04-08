package com.qima.product_catalog.repository;

import com.qima.product_catalog.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {
  // Basic CRUD methods are inherited
}
