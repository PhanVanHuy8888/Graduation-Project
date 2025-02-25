package com.example.graduate_proejct.repository;

import com.example.graduate_proejct.entity.Cart;
import com.example.graduate_proejct.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Integer> {
    List<Cart> findByUser(User user);
    Optional<Cart> findByUserAndMedicineName(User user, String medicineName);
}
