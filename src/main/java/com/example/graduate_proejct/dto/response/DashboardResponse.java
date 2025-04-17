package com.example.graduate_proejct.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DashboardResponse {
    private long totalOrders;
    private long totalProducts;
    private double totalRevenue;
}

