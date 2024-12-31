package com.revature.project1.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.revature.project1.entity.Role;

public interface RoleRepository extends JpaRepository<Role, Long> {

}
