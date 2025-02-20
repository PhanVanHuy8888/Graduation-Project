package com.example.graduate_proejct.repository;

import com.example.graduate_proejct.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    boolean existsByUserName(String userName);

    Optional<User> findByEmail(String userName);

    Optional<User> findByUserName(String userName);

    @Query("SELECT u.id FROM User u WHERE u.userName = :username")
    String findIdByUserName(@Param("username") String username);
}
