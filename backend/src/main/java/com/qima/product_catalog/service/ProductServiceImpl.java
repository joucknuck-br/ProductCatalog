package com.qima.product_catalog.service;

import com.qima.product_catalog.dto.ProductCreateDTO;
import com.qima.product_catalog.dto.ProductDTO;
import com.qima.product_catalog.dto.ProductUpdateDTO;
import com.qima.product_catalog.exception.ResourceNotFoundException;
import com.qima.product_catalog.model.Category;
import com.qima.product_catalog.model.Product;
import com.qima.product_catalog.repository.CategoryRepository;
import com.qima.product_catalog.repository.ProductRepository;
import com.qima.product_catalog.repository.specification.ProductSpecification;
import jakarta.persistence.criteria.JoinType;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

import static com.qima.product_catalog.constant.Constants.VALID_SORT_FIELDS;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductServiceImpl implements ProductService {

  private final ProductRepository productRepository;
  private final CategoryRepository categoryRepository;
  private final Mapper mapper;

  @Override
  @Transactional(readOnly = true)
  public Page<ProductDTO> findProducts(
          String nameFilter,
          String categoryPathFilter,
          BigDecimal minPrice,
          BigDecimal maxPrice,
          Boolean inStockOnly,
          Pageable pageable
  ) {
    Specification<Product> spec = Specification.where(null);

    if (nameFilter != null && nameFilter.length() > 100) {
      throw new IllegalArgumentException("Name filter exceeds maximum length of 100 characters");
    }
    if (categoryPathFilter != null && categoryPathFilter.length() > 255) {
      throw new IllegalArgumentException("Category path filter exceeds maximum length of 255 characters");
    }
    if (minPrice != null && minPrice.compareTo(BigDecimal.ZERO) < 0) {
      throw new IllegalArgumentException("Minimum price cannot be negative");
    }
    if (maxPrice != null && maxPrice.compareTo(BigDecimal.ZERO) < 0) {
      throw new IllegalArgumentException("Maximum price cannot be negative");
    }
    if (minPrice != null && maxPrice != null && minPrice.compareTo(maxPrice) > 0) {
      throw new IllegalArgumentException("Minimum price cannot be greater than maximum price");
    }

    if (pageable.getPageSize() <= 0) {
      throw new IllegalArgumentException("Page size must be greater than zero");
    }
    if (pageable.getPageNumber() < 0) {
      throw new IllegalArgumentException("Page number cannot be negative");
    }

    if (pageable.getSort().isSorted()) {
      pageable.getSort().forEach(order -> {
        if (!VALID_SORT_FIELDS.contains(order.getProperty())) {
          throw new IllegalArgumentException("Invalid sort property: " + order.getProperty());
        }
      });
    }

    if (nameFilter != null && !nameFilter.isEmpty()) {
      spec = spec.and(ProductSpecification.nameContains(nameFilter));
    }
    if (categoryPathFilter != null && !categoryPathFilter.isEmpty()) {
      spec = spec.and(ProductSpecification.categoryPathStartsWith(categoryPathFilter));
    }
    if (minPrice != null) {
      spec = spec.and(ProductSpecification.priceGreaterThanOrEqual(minPrice));
    }
    if (maxPrice != null) {
      spec = spec.and(ProductSpecification.priceLessThanOrEqual(maxPrice));
    }
    if (Boolean.TRUE.equals(inStockOnly)) {
      spec = spec.and(ProductSpecification.inStock());
    }

    Specification<Product> fetchSpec = (root, query, cb) -> {
      assert query != null;
      if (Long.class != query.getResultType()) {
        root.fetch("category", JoinType.LEFT);
      }
      return null;
    };

    Specification<Product> finalSpec = spec.and(fetchSpec);


    Page<Product> productPage = productRepository.findAll(finalSpec, pageable);

    return productPage.map(mapper::toProductDTO);
  }

  @Override
  @Transactional(readOnly = true)
  public ProductDTO getProductById(Integer id) {
    Product product = productRepository.findById(id)
            .map(p -> {
              p.getCategory().getName();
              return p;
            })
            .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    return mapper.toProductDTO(product);
  }

  @Override
  public ProductDTO createProduct(ProductCreateDTO createDTO) {
    Category category = categoryRepository.findById(createDTO.categoryId())
            .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + createDTO.categoryId()));

    Product product = new Product();
    product.setCategory(category);
    product.setName(createDTO.name());
    product.setDescription(createDTO.description());
    product.setPrice(createDTO.price());
    product.setStockQuantity(createDTO.stockQuantity());
    product.setSku(createDTO.sku());

    Product savedProduct = productRepository.save(product);
    return mapper.toProductDTO(savedProduct);
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
    return mapper.toProductDTO(updatedProduct);
  }

  @Override
  public void deleteProduct(Integer id) {
    if (!productRepository.existsById(id)) {
      throw new ResourceNotFoundException("Product not found with id: " + id);
    }
    productRepository.deleteById(id);
  }
}
