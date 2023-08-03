package ru.kata.spring.boot_security.demo.services;

import org.springframework.stereotype.Service;
import ru.kata.spring.boot_security.demo.dao.RoleDAO;
import ru.kata.spring.boot_security.demo.models.Role;

import java.util.Set;

@Service
public class RoleServiceImpl implements RoleService {

    private final RoleDAO roleDAOImpl;

    public RoleServiceImpl(RoleDAO roleDAOImpl) {
        this.roleDAOImpl = roleDAOImpl;
    }

    public Set<Role> getAllRoles() {
        return roleDAOImpl.getAllRoles();
    }
}
