package com.example.graduate_proejct.service;

import com.example.graduate_proejct.entity.Order;
import com.example.graduate_proejct.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;

    public Order createOrder(Order order) {
        return orderRepository.save(order);
    }

    public Order getOrderById(Integer id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order updateOrder(Integer id, Order orderDetails) {
        Order order = getOrderById(id);
        order.setUser(orderDetails.getUser());
        order.setEmail(orderDetails.getEmail());
        order.setAddress(orderDetails.getAddress());
        order.setNote(orderDetails.getNote());
        order.setMedicines(orderDetails.getMedicines());
        order.setPrice(orderDetails.getPrice());
        order.setPay(orderDetails.getPay());
        return orderRepository.save(order);
    }

    public void deleteOrder(Integer id) {
        orderRepository.deleteById(id);
    }
}

