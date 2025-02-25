package com.example.graduate_proejct.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CartRequest {
    private String userId;
    private String medicineName;
    private Double price;
    private Integer quantity;
}
