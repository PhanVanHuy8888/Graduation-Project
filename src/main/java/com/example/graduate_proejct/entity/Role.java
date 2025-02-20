package com.example.graduate_proejct.entity;

import jakarta.persistence.Entity;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Role extends AbstractEntity<String>{

    private String name;

    private String description;
}
