package com.example.graduate_proejct.repository;

import com.example.graduate_proejct.entity.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MedicineRepository extends JpaRepository<Medicine, Integer> {

    Optional<Medicine> findByName(String name);
}

