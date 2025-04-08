package com.qima.product_catalog.dto;

public record CategoryDTO(
        Integer id,
        String name,
        Integer parentCategoryId
) {}