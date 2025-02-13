package com.example.graduate_proejct.repository;

import com.example.graduate_proejct.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepo extends JpaRepository<Role, String> {

    Optional<Role> findByName(String name);
}
