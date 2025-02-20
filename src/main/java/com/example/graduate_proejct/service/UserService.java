package com.example.graduate_proejct.service;

import com.example.graduate_proejct.dto.request.UserRequest;
import com.example.graduate_proejct.dto.response.UserResponse;
import com.example.graduate_proejct.entity.Role;
import com.example.graduate_proejct.entity.User;
import com.example.graduate_proejct.mapper.UserMapper;
import com.example.graduate_proejct.repository.RoleRepository;
import com.example.graduate_proejct.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepo;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public UserDetailsService userDetailsService() {
        return username -> (UserDetails) userRepository.findByEmail(username)
                .orElseThrow(() ->  new RuntimeException("User not found by username = " + username));
    }

    public UserResponse createUser(UserRequest request) {
        if(userRepository.existsByUserName(request.getUserName()))
            throw new RuntimeException("Username already exist");

        User user = userMapper.createUser(request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setCreateTime(new Date());
        Set<Role> roles = new HashSet<>();
        if(request.getRoles() == null || request.getRoles().isEmpty()){
            Role defautRole = roleRepo.findByName("USER").orElseThrow(() -> new RuntimeException("This role not found"));
            if(defautRole != null ) {
                roles.add(defautRole);
            }
        }else {
            for (String roleName : request.getRoles()){
                Role role = roleRepo.findByName(roleName).orElseThrow(() -> new RuntimeException("This role not found"));
                if(role != null) roles.add(role);
            }
        }
        user.setRoles(roles);
        return userMapper.toUserResponse(userRepository.save(user));
    }

    public UserResponse updateUser(String id, UserRequest request) {
        User user = userRepository.findById(id).orElseThrow(() ->  new RuntimeException("User not found by id=" + id));
        userMapper.updateUser(user, request);
        var roles = roleRepo.findAllById(request.getRoles());
        user.setRoles(new HashSet<>(roles));
        return  userMapper.toUserResponse(userRepository.save(user));
    }

    public List<UserResponse> getAllUser() {
        return userRepository.findAll().stream().map(userMapper::toUserResponse).toList();
    }

    public UserResponse getUserById(String id) {
        return userMapper.toUserResponse(userRepository.findById(id).orElseThrow(() ->  new RuntimeException("User not found by id=" + id)) );
    }

    public UserResponse getUserByName(String username) {
        return userMapper.toUserResponse(userRepository.findByUserName(username)
                .orElseThrow(() ->  new RuntimeException("User not found by username = " + username)));
    }

    public void deleteUser(String id) {
        userRepository.deleteById(id);
    }

    public void deleteAll() {
        userRepository.deleteAll();}

}
