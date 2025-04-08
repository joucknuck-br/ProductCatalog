package com.qima.product_catalog.service;

import com.qima.product_catalog.dto.ProductCreateDTO;
import com.qima.product_catalog.dto.ProductDTO;
import com.qima.product_catalog.dto.ProductUpdateDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;

public interface ProductService {
  Page<ProductDTO> findProducts(
          String nameFilter,
          String categoryPathFilter,
          BigDecimal minPrice,
          BigDecimal maxPrice,
          Boolean inStockOnly,
          Pageable pageable
  );

  ProductDTO getProductById(Integer id);
  ProductDTO createProduct(ProductCreateDTO productCreateDTO);
  ProductDTO updateProduct(Integer id, ProductUpdateDTO productUpdateDTO);
  void deleteProduct(Integer id);
}
