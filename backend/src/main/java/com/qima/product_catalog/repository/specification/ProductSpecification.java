package com.qima.product_catalog.repository.specification;

import com.qima.product_catalog.model.Category;
import com.qima.product_catalog.model.Product;
import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;

public class ProductSpecification {

  public static Specification<Product> nameContains(String name) {
    return (root, query, criteriaBuilder) -> {
      if (!StringUtils.hasText(name)) {
        return criteriaBuilder.conjunction();
      }

      return criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), "%" + name.toLowerCase() + "%");
    };
  }

  public static Specification<Product> categoryPathStartsWith(String categoryPath) {
    return (root, query, criteriaBuilder) -> {
      if (!StringUtils.hasText(categoryPath)) {
        return criteriaBuilder.conjunction();
      }

      Join<Product, Category> categoryJoin = root.join("category", JoinType.INNER);

      return criteriaBuilder.like(categoryJoin.get("path"), categoryPath + "%");
    };
  }

  public static Specification<Product> categoryIdEquals(Integer categoryId) {
    return (root, query, criteriaBuilder) -> {
      if (categoryId == null) {
        return criteriaBuilder.conjunction();
      }
      Join<Product, Category> categoryJoin = root.join("category", JoinType.INNER);
      return criteriaBuilder.equal(categoryJoin.get("id"), categoryId);
    };
  }

  public static Specification<Product> priceGreaterThanOrEqual(BigDecimal minPrice) {
    return (root, query, criteriaBuilder) -> {
      if (minPrice == null) {
        return criteriaBuilder.conjunction();
      }
      return criteriaBuilder.greaterThanOrEqualTo(root.get("price"), minPrice);
    };
  }

  public static Specification<Product> priceLessThanOrEqual(BigDecimal maxPrice) {
    return (root, query, criteriaBuilder) -> {
      if (maxPrice == null) {
        return criteriaBuilder.conjunction();
      }
      return criteriaBuilder.lessThanOrEqualTo(root.get("price"), maxPrice);
    };
  }

  public static Specification<Product> inStock() {
    return (root, query, criteriaBuilder) ->
            criteriaBuilder.greaterThan(root.get("stockQuantity"), 0);
  }
}