package com.example.graduate_proejct.service;

import com.example.graduate_proejct.dto.request.RoleRequest;
import com.example.graduate_proejct.dto.response.RoleResponse;
import com.example.graduate_proejct.entity.Role;
import com.example.graduate_proejct.mapper.RoleMapper;
import com.example.graduate_proejct.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class RoleService {
    @Autowired
    private RoleRepository roleRepo;

    @Autowired
    private RoleMapper roleMapper;

    public RoleResponse createRole(RoleRequest request) {
        Role role = roleMapper.createRole(request);
        return roleMapper.toRoleResponse(roleRepo.save(role));
    }

    public RoleResponse updateRole(String name, RoleRequest request) {
        Role role = roleRepo.findByName(name).orElseThrow(() -> new RuntimeException("Role not found by name = " + name));
        roleMapper.updateRole(role, request);
        return roleMapper.toRoleResponse(roleRepo.save(role));
    }

    public List<RoleResponse> getAll() {
        return roleRepo.findAll().stream().map(roleMapper::toRoleResponse).toList();
    }

    public RoleResponse getRoleById(String name) {
        return roleMapper.toRoleResponse(roleRepo.findById(name).orElseThrow(() -> new RuntimeException("Role not found by name = " + name)));
    }


    public void deleteRole(String id) {
        roleRepo.deleteById(id);
    }
}
