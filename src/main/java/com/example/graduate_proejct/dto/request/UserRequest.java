package com.example.graduate_proejct.dto.request;

import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UserRequest {

    private String userName;

    private String email;

    private String phone;

    private String password;

    private String address;

    private LocalDate birthday;

    private String gender;

    private Set<String> roles;
}
