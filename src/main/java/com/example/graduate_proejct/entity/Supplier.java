package com.example.graduate_proejct.entity;

import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Supplier extends AbstractEntity<Integer>{

    private String supplierName;

    private String address;

    private String phoneNumber;

}
