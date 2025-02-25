package com.example.graduate_proejct.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "ordersDetail")
public class OrderDetail extends AbstractEntity<Integer>{

    @ManyToOne
    @JoinColumn(name = "order_id" ,nullable = false,
            foreignKey = @ForeignKey(name = "ORDER_DETAIL_ORD_FK"))
    private Order order;

    @ManyToOne
    @JoinColumn(name = "medicine_id", nullable = false)
    private Medicine medicine;

    private Integer quantity;

    private Double price;

    private Double total;
}
