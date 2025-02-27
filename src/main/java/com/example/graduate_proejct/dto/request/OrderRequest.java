package com.example.graduate_proejct.dto.request;

import lombok.Getter;

import java.util.List;

@Getter
public class OrderRequest {

    private String email;

    private String phone;

    private String address;

    private String note;

    private Double price;

    private String payment;

    private String userId;

    private List<OrderDetaiRequest> orderDetails;
}
