-- Create the database (optional, if it doesn't exist)
CREATE DATABASE IF NOT EXISTS product_catalog CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE DATABASE IF NOT EXISTS QIMA CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE QIMA;

-- -----------------------------------------------------
-- Table `categories`
-- Stores category information and hierarchy
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `categories` (
  `category_id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Unique identifier for the category',
  `name` VARCHAR(255) NOT NULL COMMENT 'Name of the category',
  `parent_category_id` INT UNSIGNED NULL COMMENT 'ID of the parent category (NULL for root categories)',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Timestamp when the category was created',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Timestamp when the category was last updated',
  PRIMARY KEY (`category_id`),
  UNIQUE INDEX `uq_category_name_parent` (`name`, `parent_category_id`) COMMENT 'Prevent duplicate category names under the same parent',
  INDEX `idx_parent_category_id` (`parent_category_id` ASC),
  CONSTRAINT `fk_categories_parent`
    FOREIGN KEY (`parent_category_id`)
    REFERENCES `categories` (`category_id`)
    ON DELETE RESTRICT -- Prevent deleting a category if it has subcategories. Could use SET NULL if you want subcategories to become root upon parent deletion.
    ON UPDATE CASCADE -- If a parent category_id changes, update references in child categories.
)
ENGINE = InnoDB
COMMENT = 'Stores product categories in a hierarchical structure.';


-- -----------------------------------------------------
-- Table `products`
-- Stores product information
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `products` (
  `product_id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Unique identifier for the product',
  `name` VARCHAR(255) NOT NULL COMMENT 'Name of the product',
  `description` TEXT NULL COMMENT 'Detailed description of the product',
  `sku` VARCHAR(100) NULL COMMENT 'Stock Keeping Unit - unique identifier for inventory',
  `price` DECIMAL(10,2) NOT NULL COMMENT 'Price of the product',
  `stock_quantity` INT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Available quantity in stock',
  `category_id` INT UNSIGNED NOT NULL COMMENT 'The direct category this product belongs to',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Timestamp when the product was created',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Timestamp when the product was last updated',
  PRIMARY KEY (`product_id`),
  UNIQUE INDEX `uq_sku` (`sku` ASC) COMMENT 'Ensure SKUs are unique if they are used',
  INDEX `idx_category_id` (`category_id` ASC),
  INDEX `idx_product_name` (`name` ASC), -- Index for faster searching by product name
  CONSTRAINT `fk_products_category`
    FOREIGN KEY (`category_id`)
    REFERENCES `categories` (`category_id`)
    ON DELETE RESTRICT -- Prevent deleting a category if products are assigned to it.
    ON UPDATE CASCADE -- If a category_id changes, update references in products.
)
ENGINE = InnoDB
COMMENT = 'Stores individual product details.';