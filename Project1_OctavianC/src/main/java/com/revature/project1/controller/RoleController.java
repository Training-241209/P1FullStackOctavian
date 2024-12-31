package com.revature.project1.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.revature.project1.entity.Role;
import com.revature.project1.service.RoleService;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/role")
public class RoleController {
    private final RoleService roleService;

    @Autowired
    public RoleController(RoleService roleService) {
        this.roleService = roleService;
    }

    @PostMapping("/addrole")
    private ResponseEntity<Role> addRole(@RequestBody Role role) {
        return ResponseEntity.ok().body(roleService.addRole(role));
    }
}
