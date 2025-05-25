package com.example.graduate_proejct.repository;

import com.example.graduate_proejct.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Integer> {
    List<Comment> findByMedicineId(Integer medicineId);
}

