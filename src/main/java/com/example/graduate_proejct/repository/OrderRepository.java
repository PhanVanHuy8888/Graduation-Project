package com.example.graduate_proejct.repository;

import com.example.graduate_proejct.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
    @Query("SELECT SUM(od.total) FROM Order o JOIN o.orderDetails od")
    Double sumTotalRevenue();
}
