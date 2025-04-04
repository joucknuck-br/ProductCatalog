package com.qima.product_catalog.dto;

import java.math.BigDecimal;

public record ProductDTO(
        Integer id,
        String name,
        String description,
        BigDecimal price,
        String categoryPath, // Direct mapping from category.path
        Integer stockQuantity, // Represents 'available'
        String sku
) {}
