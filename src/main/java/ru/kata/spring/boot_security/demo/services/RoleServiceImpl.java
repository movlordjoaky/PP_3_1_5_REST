package ru.kata.spring.boot_security.demo.services;

import org.springframework.stereotype.Service;
import ru.kata.spring.boot_security.demo.dao.RoleDAO;
import ru.kata.spring.boot_security.demo.models.Role;

import java.util.Set;

@Service
public class RoleServiceImpl implements RoleService {

    private RoleDAO roleDAO;

    public RoleServiceImpl(RoleDAO roleDAO) {
        this.roleDAO = roleDAO;
    }

    public Set<Role> getAllRoles() {
        RoleDAO roleDAOImpl;
        return roleDAO.getAllRoles();
    }
}
