package com.example.graduate_proejct.dto.response;

import com.example.graduate_proejct.entity.Order;
import com.example.graduate_proejct.entity.OrderDetail;
import lombok.Getter;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Getter
public class OrderResponse {
    private String orderCode;
    private String userName;
    private Double total;
    private String payment;
    private String paymentStatus;
    private Date createdAt;

    private String email;

    private String phone;
    private String note;

    private List<OrderDetailResponse> orderDetails;

    public OrderResponse(Order order) {
        this.orderCode = order.getCode();
        this.email = order.getEmail();
        this.note = order.getNote();
        this.phone = order.getPhone();
        this.userName = (order.getUser() != null) ? order.getUser().getUserName() : "Khách";
        this.total = order.getOrderDetails().stream().mapToDouble(OrderDetail::getTotal).sum();
        this.payment = order.getPayment();
        this.paymentStatus = order.getPaymentStatus();
        this.createdAt = order.getCreatedAt();
        this.orderDetails = order.getOrderDetails().stream()
                .map(OrderDetailResponse::new)
                .collect(Collectors.toList());
    }

}
