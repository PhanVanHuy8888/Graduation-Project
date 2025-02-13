package com.example.graduate_proejct.controller;

import com.example.graduate_proejct.dto.request.RoleRequest;
import com.example.graduate_proejct.dto.response.RoleResponse;
import com.example.graduate_proejct.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/roles")
public class RoleController {

    @Autowired
    private RoleService roleService;

    @PostMapping
    public RoleResponse createRole(@RequestBody RoleRequest request) {
        return roleService.createRole(request);
    }

    @GetMapping("/list")
    public List<RoleResponse> getAllRole() {
        return roleService.getAll();
    }

    @GetMapping("/{name}")
    public RoleResponse getRoleById(@PathVariable String name) {
        return roleService.getRoleById(name);
    }

    @PutMapping("/{name}")
    public RoleResponse updateRole(@PathVariable String name, @RequestBody RoleRequest request) {
        return roleService.updateRole(name, request);
    }

    @DeleteMapping("/{name}")
    public String deleteRole(@PathVariable String name) {
        roleService.deleteRole(name);
        return "Role has been deleted";
    }
}
