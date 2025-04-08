package com.qima.product_catalog.controller;

import com.qima.product_catalog.dto.ProductCreateDTO;
import com.qima.product_catalog.dto.ProductDTO;
import com.qima.product_catalog.dto.ProductUpdateDTO;
import com.qima.product_catalog.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

import static com.qima.product_catalog.constant.Constants.DEFAULT_SORT_PROPERTY;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

  private final ProductService productService;

  @GetMapping
  public ResponseEntity<Page<ProductDTO>> findProducts(
          @RequestParam(required = false) String name,
          @RequestParam(required = false) String categoryPath,
          @RequestParam(required = false) BigDecimal minPrice,
          @RequestParam(required = false) BigDecimal maxPrice,
          @RequestParam(required = false) Boolean inStockOnly,
          @RequestParam(defaultValue = "0") int page,
          @RequestParam(defaultValue = "10") int size,
          @RequestParam(required = false) String sortBy,
          @RequestParam(defaultValue = "asc", required = false) String sortDir
  ) {
    String sortField = StringUtils.hasText(sortBy) ? sortBy : DEFAULT_SORT_PROPERTY;
    Sort.Direction direction = Sort.Direction.fromString(
            "desc".equalsIgnoreCase(sortDir) ? "DESC" : "ASC"
    );
    Sort sort = Sort.by(direction, sortField);
    Pageable pageable = PageRequest.of(page, size, sort);

    Page<ProductDTO> productPage = productService.findProducts(
            name, categoryPath, minPrice, maxPrice, inStockOnly, pageable
    );
    return ResponseEntity.ok(productPage);
  }

  @GetMapping("/{id}")
  public ResponseEntity<ProductDTO> getProductById(@PathVariable Integer id) {
    ProductDTO product = productService.getProductById(id);
    return ResponseEntity.ok(product);
  }

  @PostMapping
  public ResponseEntity<ProductDTO> createProduct(@Valid @RequestBody ProductCreateDTO createDTO) {
    ProductDTO createdProduct = productService.createProduct(createDTO);
    return ResponseEntity.status(HttpStatus.CREATED).body(createdProduct);
  }

  @PutMapping("/{id}")
  public ResponseEntity<ProductDTO> updateProduct(@PathVariable Integer id, @Valid @RequestBody ProductUpdateDTO updateDTO) {
    ProductDTO updatedProduct = productService.updateProduct(id, updateDTO);
    return ResponseEntity.ok(updatedProduct);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteProduct(@PathVariable Integer id) {
    productService.deleteProduct(id);
    return ResponseEntity.noContent().build();
  }
}
