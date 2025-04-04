package com.qima.product_catalog.service;

import com.qima.product_catalog.dto.ProductCreateDTO;
import com.qima.product_catalog.dto.ProductDTO;
import com.qima.product_catalog.dto.ProductUpdateDTO;
import java.util.List;

public interface ProductService {
  List<ProductDTO> getAllProducts();
  ProductDTO getProductById(Integer id);
  ProductDTO createProduct(ProductCreateDTO productCreateDTO);
  ProductDTO updateProduct(Integer id, ProductUpdateDTO productUpdateDTO);
  void deleteProduct(Integer id);
}
