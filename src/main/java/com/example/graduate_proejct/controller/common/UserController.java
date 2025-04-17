package com.example.graduate_proejct.controller.common;

import com.example.graduate_proejct.dto.request.UserRequest;
import com.example.graduate_proejct.dto.response.UserResponse;
import com.example.graduate_proejct.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping
    public UserResponse createUser(@RequestBody UserRequest request) {
        return userService.createUser(request);
    }

    @PutMapping("/{id}")
    public UserResponse updateUser(@PathVariable String id, @RequestBody UserRequest request){
        UserResponse userResponse = userService.updateUser(id, request);
        return userResponse;
    }

    @GetMapping("/{id}")
    public UserResponse getUserById(@PathVariable String id) {
        UserResponse user = userService.getUserById(id);
        return user;
    }
    @GetMapping("/listUser")
    public List<UserResponse> getAll() {
        return userService.getAllUser();

    }

    @DeleteMapping("/{id}")
    public String deleteUserById(@PathVariable String id) {
        userService.deleteUser(id);
        return "User has been deleted";
    }

    @DeleteMapping("/deleteAll")
    public String deleteAllUser() {
        userService.deleteAll();
        return "User has been deleted ALL";
    }


    @GetMapping("/getUser")
    public UserResponse getUByName(Principal principal) {
        String username = principal.getName();
        UserResponse user = userService.getUserByName(username);
        return user;
    }
}
