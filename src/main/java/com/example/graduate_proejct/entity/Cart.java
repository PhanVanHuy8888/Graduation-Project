package com.example.graduate_proejct.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "cart")
public class Cart extends AbstractEntity<Integer>{

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String medicineName;

    private Double price;

    private Double total;

    private Integer quantity;
}

