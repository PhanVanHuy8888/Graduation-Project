package com.example.graduate_proejct.repository;

import com.example.graduate_proejct.entity.CategoryMedicine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryMedicineRepository extends JpaRepository<CategoryMedicine, Integer> {
}
