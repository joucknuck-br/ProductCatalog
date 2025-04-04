package com.qima.product_catalog.controller;

import com.qima.product_catalog.dto.ProductCreateDTO;
import com.qima.product_catalog.dto.ProductDTO;
import com.qima.product_catalog.dto.ProductUpdateDTO;
import com.qima.product_catalog.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

  private final ProductService productService;

  @GetMapping
  public ResponseEntity<List<ProductDTO>> getAllProducts() {
    List<ProductDTO> products = productService.getAllProducts();
    return ResponseEntity.ok(products);
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
