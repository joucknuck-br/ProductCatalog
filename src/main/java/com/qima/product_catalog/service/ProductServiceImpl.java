package com.qima.product_catalog.service;

import com.qima.product_catalog.dto.ProductCreateDTO;
import com.qima.product_catalog.dto.ProductDTO;
import com.qima.product_catalog.dto.ProductUpdateDTO;
import com.qima.product_catalog.exception.ResourceNotFoundException;
import com.qima.product_catalog.model.Category;
import com.qima.product_catalog.model.Product;
import com.qima.product_catalog.repository.CategoryRepository;
import com.qima.product_catalog.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductServiceImpl implements ProductService {

  private final ProductRepository productRepository;
  private final CategoryRepository categoryRepository;
  private final ProductMapper productMapper;

  @Override
  @Transactional(readOnly = true)
  public List<ProductDTO> getAllProducts() {
    return productRepository.findAll()
            .stream()
            .map(productMapper::toProductDTO)
            .collect(Collectors.toList());
  }

  @Override
  @Transactional(readOnly = true)
  public ProductDTO getProductById(Integer id) {
    Product product = productRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    return productMapper.toProductDTO(product);
  }

  @Override
  public ProductDTO createProduct(ProductCreateDTO createDTO) {
    Category category = categoryRepository.findById(createDTO.categoryId())
            .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + createDTO.categoryId()));

    Product product = new Product();
    product.setName(createDTO.name());
    product.setDescription(createDTO.description());
    product.setPrice(createDTO.price());
    product.setStockQuantity(createDTO.stockQuantity());
    product.setSku(createDTO.sku());
    product.setCategory(category); // Link the category

    Product savedProduct = productRepository.save(product);
    return productMapper.toProductDTO(savedProduct);
  }

  @Override
  public ProductDTO updateProduct(Integer id, ProductUpdateDTO updateDTO) {
    Product existingProduct = productRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

    Category category = categoryRepository.findById(updateDTO.categoryId())
            .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + updateDTO.categoryId()));

    existingProduct.setName(updateDTO.name());
    existingProduct.setDescription(updateDTO.description());
    existingProduct.setPrice(updateDTO.price());
    existingProduct.setStockQuantity(updateDTO.stockQuantity());
    existingProduct.setSku(updateDTO.sku());
    existingProduct.setCategory(category);

    Product updatedProduct = productRepository.save(existingProduct);
    return productMapper.toProductDTO(updatedProduct);
  }

  @Override
  public void deleteProduct(Integer id) {
    if (!productRepository.existsById(id)) {
      throw new ResourceNotFoundException("Product not found with id: " + id);
    }
    productRepository.deleteById(id);
  }
}
