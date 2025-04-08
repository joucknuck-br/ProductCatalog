package com.qima.product_catalog.dto;

import java.math.BigDecimal;

public record ProductDTO(
        Integer id,
        String name,
        String description,
        BigDecimal price,
        String categoryPath,
        Integer stockQuantity,
        Integer categoryId,
        String sku
) {}
