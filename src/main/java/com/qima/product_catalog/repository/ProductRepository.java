package com.qima.product_catalog.repository;

import com.qima.product_catalog.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {
  @Query("SELECT p FROM Product p JOIN FETCH p.category")
  @Override
  List<Product> findAll();
}
