package com.qima.product_catalog.dto;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;
public record ProductCreateDTO(
        @NotBlank(message = "Product name cannot be blank")
        String name,

        String description,

        @NotNull(message = "Price cannot be null")
        @DecimalMin(value = "0.0", inclusive = false, message = "Price must be positive")
        BigDecimal price,

        @NotNull(message = "Category ID cannot be null")
        Integer categoryId,

        @NotNull(message = "Stock quantity cannot be null")
        @Min(value = 0, message = "Stock quantity cannot be negative")
        Integer stockQuantity,

        String sku
) {}
