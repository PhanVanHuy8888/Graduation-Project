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
@Table(name = "categoryMedicine")
public class CategoryMedicine extends AbstractEntity<Integer>{

    private String categoryMedicineName;

}
