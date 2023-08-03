package ru.kata.spring.boot_security.demo.dao;

import ru.kata.spring.boot_security.demo.models.Role;

import java.util.Set;

public interface RoleDAO {
    Set<Role> getAllRoles();
}
