package com.example.graduate_proejct.controller.common;

import com.example.graduate_proejct.entity.CategoryMedicine;
import com.example.graduate_proejct.service.CategoryMedicineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/category-medicine")
public class CategoryMedicineController {
    @Autowired
    private CategoryMedicineService categoryMedicineService;

    @PostMapping
    public ResponseEntity<CategoryMedicine> createCategoryMedicine(@RequestBody CategoryMedicine categoryMedicine) {
        return ResponseEntity.ok(categoryMedicineService.createCategoryMedicine(categoryMedicine));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryMedicine> getCategoryMedicineById(@PathVariable Integer id) {
        return ResponseEntity.ok(categoryMedicineService.getCategoryMedicineById(id));
    }

    @GetMapping
    public ResponseEntity<List<CategoryMedicine>> getAllCategoryMedicines() {
        return ResponseEntity.ok(categoryMedicineService.getAllCategoryMedicines());
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoryMedicine> updateCategoryMedicine(@PathVariable Integer id, @RequestBody CategoryMedicine categoryMedicine) {
        return ResponseEntity.ok(categoryMedicineService.updateCategoryMedicine(id, categoryMedicine));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategoryMedicine(@PathVariable Integer id) {
        categoryMedicineService.deleteCategoryMedicine(id);
        return ResponseEntity.noContent().build();
    }
}
