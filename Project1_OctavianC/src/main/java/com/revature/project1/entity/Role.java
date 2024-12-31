package com.revature.project1.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Data
@Entity
@Table(name = "role")
public class Role {
    @Column(name = "roleId")
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer roleId;

    @Column(name = "roleName")
    private String roleName;

    public Role() {

    }

    public Role(Integer id, String roleName) {
        this.roleId = id;
        this.roleName = roleName;
    }

    @Override
    public String toString() {
        return "Role{" +
                "roleId=" + roleId + '\'' +
                ", roleName='" + roleName + '\'' +
                '}';
    }
}
