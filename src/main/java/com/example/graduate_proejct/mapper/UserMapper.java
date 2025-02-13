package com.example.graduate_proejct.mapper;

import com.example.graduate_proejct.dto.request.UserRequest;
import com.example.graduate_proejct.dto.response.UserResponse;
import com.example.graduate_proejct.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "roles", ignore = true)
    User createUser(UserRequest request);

    UserResponse toUserResponse(User user);

    @Mapping(target = "roles", ignore = true)
    void updateUser(@MappingTarget User user, UserRequest request);
}
