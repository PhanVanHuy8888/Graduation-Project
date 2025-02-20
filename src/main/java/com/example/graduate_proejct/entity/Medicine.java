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
@Table(name = "medicine")
public class Medicine extends AbstractEntity<Integer>{

    private String name;

    private Double price;

    private String description;

    private String manufacturer;

    private String ingredient;

    private String registrationNumber;

    private String sualityStandards;

    private String shelfLife;

    private String dosageForm;

    private String specification;

    private String origin;

    @ManyToOne
    @JoinColumn(name = "category_medicine_id", nullable = false)
    private CategoryMedicine categoryMedicine;

    @ManyToOne
    @JoinColumn(name = "supplier_id", nullable = false)
    private Supplier supplier;
}
