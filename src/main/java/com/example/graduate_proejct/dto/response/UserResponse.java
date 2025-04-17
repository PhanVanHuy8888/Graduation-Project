package com.example.graduate_proejct.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.util.Date;

@Builder
@Getter
public class UserResponse {

    private String id;

    private String userName;

    private String email;

    private String phone;

    private String address;

    private Date birthday;

    private String gender;
}
