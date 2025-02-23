package com.example.graduate_proejct.service;

import com.example.graduate_proejct.entity.CategoryMedicine;
import com.example.graduate_proejct.repository.CategoryMedicineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryMedicineService {
    @Autowired
    private CategoryMedicineRepository categoryMedicineRepository;

    public CategoryMedicine createCategoryMedicine(CategoryMedicine categoryMedicine) {
        return categoryMedicineRepository.save(categoryMedicine);
    }

    public CategoryMedicine getCategoryMedicineById(Integer id) {
        return categoryMedicineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("CategoryMedicine not found"));
    }

    public List<CategoryMedicine> getAllCategoryMedicines() {
        return categoryMedicineRepository.findAll();
    }

    public CategoryMedicine updateCategoryMedicine(Integer id, CategoryMedicine categoryMedicineDetails) {
        CategoryMedicine categoryMedicine = getCategoryMedicineById(id);
        categoryMedicine.setCategoryMedicineName(categoryMedicineDetails.getCategoryMedicineName());
        return categoryMedicineRepository.save(categoryMedicine);
    }

    public void deleteCategoryMedicine(Integer id) {
        categoryMedicineRepository.deleteById(id);
    }
}

