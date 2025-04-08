package com.qima.product_catalog.service;

import com.qima.product_catalog.dto.CategoryDTO;
import com.qima.product_catalog.model.Category;
import com.qima.product_catalog.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

  private final CategoryRepository categoryRepository;
  private final Mapper mapper;

  @Override
  @Transactional(readOnly = true)
  public List<CategoryDTO> getAllCategories() {
    List<Category> categories = categoryRepository.findAll();
    return categories.stream()
            .map(mapper::convertToDTO)
            .collect(Collectors.toList());
  }

  @Override
  @Transactional(readOnly = true)
  public CategoryDTO getCategoryById(Integer id) {
    Category category = categoryRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Category not found"));
    return mapper.convertToDTO(category);
  }

  @Override
  @Transactional
  public CategoryDTO createCategory(CategoryDTO categoryDTO) {
    Category category = new Category();
    category.setName(categoryDTO.name());

    Category parentCategory = categoryDTO.parentCategoryId() != null ?
            categoryRepository.findById(categoryDTO.parentCategoryId())
                    .orElseThrow(() -> new RuntimeException("Parent category not found")) : null;
    category.setParentCategory(parentCategory);
    category.setPath(parentCategory != null ? parentCategory.getPath() + " > " + categoryDTO.name() : categoryDTO.name());

    Category savedCategory = categoryRepository.save(category);
    return mapper.convertToDTO(savedCategory);
  }

  @Override
  @Transactional
  public CategoryDTO updateCategory(Integer id, CategoryDTO categoryDTO) {
    Category category = categoryRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Category not found"));
    category.setName(categoryDTO.name());

    Category parentCategory = categoryDTO.parentCategoryId() != null ?
            categoryRepository.findById(categoryDTO.parentCategoryId())
                    .orElseThrow(() -> new RuntimeException("Parent category not found")) : null;
    category.setParentCategory(parentCategory);
    category.setPath(parentCategory != null ? parentCategory.getPath() + " > " + categoryDTO.name() : categoryDTO.name());

    Category updatedCategory = categoryRepository.save(category);
    return mapper.convertToDTO(updatedCategory);
  }

  @Override
  @Transactional
  public void deleteCategory(Integer id) {
    Category category = categoryRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Category not found"));
    categoryRepository.delete(category);
  }
}