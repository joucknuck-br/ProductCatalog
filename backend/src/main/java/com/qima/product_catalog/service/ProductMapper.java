package com.qima.product_catalog.service;

import com.qima.product_catalog.dto.ProductDTO;
import com.qima.product_catalog.model.Product;
import org.springframework.stereotype.Component;

@Component // Or just make methods static
public class ProductMapper {

  public ProductDTO toProductDTO(Product product) {
    if (product == null) {
      return null;
    }
    String categoryPath = (product.getCategory() != null) ? product.getCategory().getPath() : "N/A";

    return new ProductDTO(
            product.getId(),
            product.getName(),
            product.getDescription(),
            product.getPrice(),
            categoryPath, // Get path from the associated Category entity
            product.getStockQuantity(),
            product.getSku()
    );
  }
}
