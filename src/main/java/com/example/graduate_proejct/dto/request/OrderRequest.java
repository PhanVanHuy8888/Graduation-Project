package com.example.graduate_proejct.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class OrderRequest {

    private String username;

    private String email;

    private String phone;

    private String address;

    private String note;

    private Double price;

    private String payment;

    private String userId;

    private List<OrderDetaiRequest> orderDetails;
}
