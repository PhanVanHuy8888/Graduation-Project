package com.example.graduate_proejct.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
public class User extends AbstractEntity<String>{

    private String userName;

    private String password;

    private String email;

    private String phone;

    private String address;

    private Date birthday;

    private String gender;

    private Date createTime;

    private Date updateTime;

    @ManyToMany()
    Set<Role> roles;

    @OneToMany(mappedBy = "user")
    private Set<Order> orders;
}
