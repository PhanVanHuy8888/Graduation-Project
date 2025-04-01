package com.example.graduate_proejct.dto.response;

import com.example.graduate_proejct.entity.OrderDetail;
import lombok.Getter;

@Getter
public class OrderDetailResponse {
    private String medicineName;
    private Integer quantity;
    private Double price;
    private Double total;

    public OrderDetailResponse(OrderDetail detail) {
        this.medicineName = detail.getMedicine().getName();
        this.quantity = detail.getQuantity();
        this.price = detail.getPrice();
        this.total = detail.getTotal();
    }
}
