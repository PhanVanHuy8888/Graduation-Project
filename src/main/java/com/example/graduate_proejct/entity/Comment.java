package com.example.graduate_proejct.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "comment")
public class Comment extends AbstractEntity<Integer>{

    @ManyToOne
    private Medicine medicine;

    @ManyToOne
    private User user;

    private String content;

    private int rating;
}
