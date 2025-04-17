package com.example.graduate_proejct.controller.common;

import com.example.graduate_proejct.dto.response.DashboardResponse;
import com.example.graduate_proejct.service.MedicineService;
import com.example.graduate_proejct.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final OrderService orderService;
    private final MedicineService medicineService;

    public DashboardController(OrderService orderService, MedicineService medicineService) {
        this.orderService = orderService;
        this.medicineService = medicineService;
    }

    @GetMapping
    public ResponseEntity<DashboardResponse> getDashboardData() {
        long orders = orderService.countAllOrders();
        long products = medicineService.countAllProducts();
        double revenue = orderService.calculateTotalRevenue();

        DashboardResponse response = new DashboardResponse(orders, products, revenue);
        return ResponseEntity.ok(response);
    }
}

