package com.example.graduate_proejct.mapper;

import com.example.graduate_proejct.dto.request.UserRequest;
import com.example.graduate_proejct.dto.response.UserResponse;
import com.example.graduate_proejct.entity.Role;
import com.example.graduate_proejct.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "roles", ignore = true)
    User createUser(UserRequest request);

    UserResponse toUserResponse(User user);

    default Set<String> mapRoles(Set<Role> roles) {
        if (roles == null) return null;
        return roles.stream()
                .map(Role::getName)
                .collect(Collectors.toSet());
    }

    @Mapping(target = "roles", ignore = true)
    void updateUser(@MappingTarget User user, UserRequest request);
}
