package com.example.graduate_proejct.mapper;

import com.example.graduate_proejct.dto.request.RoleRequest;
import com.example.graduate_proejct.dto.response.RoleResponse;
import com.example.graduate_proejct.entity.Role;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface RoleMapper {

    Role createRole(RoleRequest request);

    RoleResponse toRoleResponse(Role role);

    void updateRole(@MappingTarget Role role, RoleRequest request);
}
