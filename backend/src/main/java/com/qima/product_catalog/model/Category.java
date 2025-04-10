package com.qima.product_catalog.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "categories")
@Getter
@Setter
@NoArgsConstructor
public class Category {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "category_id")
  private Integer id;

  @Column(name = "name", nullable = false, length = 255)
  private String name;

  @Column(name = "path", length = 1000)
  private String path;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "parent_category_id")
  private Category parentCategory;

  @OneToMany(mappedBy = "parentCategory", cascade = CascadeType.PERSIST)
  private Set<Category> subCategories = new HashSet<>();

  @OneToMany(mappedBy = "category", fetch = FetchType.LAZY)
  private Set<Product> products = new HashSet<>();

  @CreationTimestamp
  @Column(name = "created_at", nullable = false, updatable = false)
  private LocalDateTime createdAt;

  @UpdateTimestamp
  @Column(name = "updated_at", nullable = false)
  private LocalDateTime updatedAt;
}
