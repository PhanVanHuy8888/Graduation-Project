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
public class Contact extends AbstractEntity<Integer>{

    private String fullName;

    private String email;

    private String phoneNumber;

    private String message;
}
