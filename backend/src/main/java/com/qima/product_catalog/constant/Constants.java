package com.qima.product_catalog.constant;

import java.util.List;

public class Constants {
  public static final String DEFAULT_SORT_PROPERTY = "name";
  public static final List<String> VALID_SORT_FIELDS = List.of(
      "name",
      "categoryPath",
      "price",
      "stockQuantity",
      "createdAt",
      "updatedAt"
  );
}
