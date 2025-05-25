package com.example.graduate_proejct.controller.common;

import com.example.graduate_proejct.dto.request.OrderRequest;
import com.example.graduate_proejct.dto.response.OrderResponse;
import com.example.graduate_proejct.entity.Order;
import com.example.graduate_proejct.repository.UserRepository;
import com.example.graduate_proejct.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/order")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody OrderRequest orderRequest, Principal principal) {
        try {

            // Tạo đơn hàng từ orderRequest
            return ResponseEntity.ok(orderService.createOrder(orderRequest));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Integer id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    @GetMapping
    public ResponseEntity<Page<OrderResponse>> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        Page<Order> ordersPage = orderService.getAllOrders(PageRequest.of(page, size));
        Page<OrderResponse> responsePage = ordersPage.map(OrderResponse::new);
        return ResponseEntity.ok(responsePage);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Integer id) {
        orderService.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/mark-paid/{orderId}")
    public ResponseEntity<?> markAsPaid(@PathVariable Integer orderId) {
        try {
            orderService.markAsPaid(orderId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order not found");
        }
    }

    @GetMapping("/status/{orderId}")
    public ResponseEntity<Map<String, String>> getStatus(@PathVariable Integer orderId) {
        String status = orderService.getOrderStatus(orderId);
        return ResponseEntity.ok(Map.of("status", status));
    }
}
