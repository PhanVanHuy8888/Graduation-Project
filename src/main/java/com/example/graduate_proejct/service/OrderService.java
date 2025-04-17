package com.example.graduate_proejct.service;

import com.example.graduate_proejct.dto.request.OrderRequest;
import com.example.graduate_proejct.entity.Medicine;
import com.example.graduate_proejct.entity.Order;
import com.example.graduate_proejct.entity.OrderDetail;
import com.example.graduate_proejct.entity.User;
import com.example.graduate_proejct.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {

    private final OrderRepository orderRepository;

    private final OrderDetailRepository orderDetailRepository;

    private final CartRepository cartRepository;

    private final MedicineRepository medicineRepository;

    private final UserRepository userRepository;

    @Transactional
    public Order createOrder(OrderRequest orderRequest) {

        User user = userRepository.findById(orderRequest.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Random random = new Random();
        int randomNum = random.nextInt(1000);
        Order order = new Order();
        order.setEmail(orderRequest.getEmail());
        order.setCode("EP_00" + randomNum);
        order.setPhone(orderRequest.getPhone());
        order.setAddress(orderRequest.getAddress());
        order.setNote(orderRequest.getNote());
        order.setPayment(orderRequest.getPayment());
        order.setPaymentStatus("Processing");
        order.setUser(user);

        order = orderRepository.save(order);

        Order finalOrder = order;
        List<OrderDetail> orderDetails = orderRequest.getOrderDetails().stream().map(detailDTO -> {
            Medicine medicine = medicineRepository.findByName(detailDTO.getMedicineName())
                    .orElseThrow(() -> new RuntimeException("Medicine not found"));

            OrderDetail orderDetail = new OrderDetail();
            orderDetail.setOrder(finalOrder);
            orderDetail.setMedicine(medicine);
            orderDetail.setQuantity(detailDTO.getQuantity());
            orderDetail.setPrice(detailDTO.getPrice());
            orderDetail.setTotal(detailDTO.getQuantity() * detailDTO.getPrice());

            // Cập nhật số lượng của sản phẩm trong kho sau khi tạo đơn hàng
            int newQuantity = medicine.getQuantity() - detailDTO.getQuantity();
            if (newQuantity < 0) {
                throw new RuntimeException("Not enough stock for " + medicine.getName());
            }
            medicine.setQuantity(newQuantity); // Trừ số lượng sản phẩm trong kho
            medicineRepository.save(medicine); // Lưu lại thông tin sản phẩm đã cập nhật

            return orderDetail;
        }).collect(Collectors.toList());

        orderDetailRepository.saveAll(orderDetails);
        cartRepository.deleteCartByUserId(orderRequest.getUserId());

        return order;
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
//        order.setUser(orderDetails.getUser());
//        order.setEmail(orderDetails.getEmail());
//        order.setAddress(orderDetails.getAddress());
//        order.setNote(orderDetails.getNote());
//        order.setMedicines(orderDetails.getMedicines());
//        order.setPrice(orderDetails.getPrice());
//        order.setPay(orderDetails.getPay());
        return orderRepository.save(order);
    }

    public void deleteOrder(Integer id) {
        orderRepository.deleteById(id);
    }

    public double calculateTotalRevenue() {
        return orderRepository.sumTotalRevenue();
    }

    public long countAllOrders() {
        return orderRepository.count();
    }
}

