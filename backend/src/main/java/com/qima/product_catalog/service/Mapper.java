package com.qima.product_catalog.service;

import com.qima.product_catalog.dto.CategoryDTO;
import com.qima.product_catalog.dto.ProductDTO;
import com.qima.product_catalog.model.Category;
import com.qima.product_catalog.model.Product;
import org.springframework.stereotype.Component;

@Component
public class Mapper {

  public ProductDTO toProductDTO(Product product) {
    if (product == null) {
      return null;
    }
    String categoryPath = (product.getCategory() != null) ? product.getCategory().getPath() : "N/A";

    assert product.getCategory() != null;
    return new ProductDTO(
            product.getId(),
            product.getName(),
            product.getDescription(),
            product.getPrice(),
            categoryPath,
            product.getStockQuantity(),
            product.getCategory().getId(),
            product.getSku()
    );
  }

  public CategoryDTO convertToDTO(Category category) {
    if (category == null) {
      return null;
    }
    return new CategoryDTO(
            category.getId(),
            category.getName(),
            category.getParentCategory() != null ? category.getParentCategory().getId() : null
    );
  }
}
