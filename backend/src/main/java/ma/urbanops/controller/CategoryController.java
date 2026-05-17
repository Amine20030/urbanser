package ma.urbanops.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import ma.urbanops.dto.response.CategoryResponse;
import ma.urbanops.entity.Category;
import ma.urbanops.service.CategoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
@Tag(name = "Categories", description = "Incident category catalog")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"}, allowedHeaders = "*")
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    @Operation(summary = "Get all active categories")
    public ResponseEntity<List<CategoryResponse>> getAllCategories() {
        List<Category> categories = categoryService.findAllActive();
        return ResponseEntity.ok(categories.stream().map(categoryService::toResponse).toList());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get category by ID")
    public ResponseEntity<CategoryResponse> getCategoryById(@PathVariable Long id) {
        return ResponseEntity.ok(categoryService.toResponse(categoryService.findById(id)));
    }
}
