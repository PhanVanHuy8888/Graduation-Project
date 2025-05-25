package com.example.graduate_proejct.dto.response;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class RoleResponse {

    private String id;

    private String name;

    private String description;
}
