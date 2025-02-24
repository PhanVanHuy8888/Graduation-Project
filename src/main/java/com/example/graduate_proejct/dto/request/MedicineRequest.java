package com.example.graduate_proejct.dto.request;

import com.example.graduate_proejct.entity.CategoryMedicine;
import com.example.graduate_proejct.entity.Supplier;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class MedicineRequest {

    private String name;

    private Double price;

    private String description;

    private String manufacturer;

    private String ingredient;

    private String registrationNumber;

    private String qualityStandards;

    private String shelfLife;

    private String dosageForm;

    private Integer quantity;

    private String specification;

    private String origin;

    private Integer categoryMedicineId;

    private Integer supplierId;
}
