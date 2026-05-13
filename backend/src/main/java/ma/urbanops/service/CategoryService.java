package ma.urbanops.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.urbanops.dto.response.CategoryResponse;
import ma.urbanops.entity.Category;
import ma.urbanops.exception.ResourceNotFoundException;
import ma.urbanops.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service @Slf4j @RequiredArgsConstructor @Transactional
public class CategoryService {
    private final CategoryRepository categoryRepository;

    @Transactional(readOnly=true)
    public List<Category> findAll() { return categoryRepository.findAll(); }

    @Transactional(readOnly=true)
    public Category findById(Long id) {
        return categoryRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Category","id",id));
    }

    @Transactional(readOnly=true)
    public List<Category> findAllActive() { return categoryRepository.findAll(); }

    public Category create(Category c) { return categoryRepository.save(c); }

    public Category update(Long id, Category categoryDetails) {
        Category category = findById(id);
        if(categoryDetails.getName() != null) category.setName(categoryDetails.getName());
        if(categoryDetails.getIcon() != null) category.setIcon(categoryDetails.getIcon());
        if(categoryDetails.getDefaultAuthority() != null) category.setDefaultAuthority(categoryDetails.getDefaultAuthority());
        if(categoryDetails.getAuthorityEmail() != null) category.setAuthorityEmail(categoryDetails.getAuthorityEmail());
        return categoryRepository.save(category);
    }

    public void delete(Long id) { categoryRepository.deleteById(id); }

    public CategoryResponse toResponse(Category c) {
        return CategoryResponse.builder()
            .id(c.getId()).name(c.getName()).icon(c.getIcon())
            .defaultAuthority(c.getDefaultAuthority())
            .authorityEmail(c.getAuthorityEmail())
            .build();
    }
}
