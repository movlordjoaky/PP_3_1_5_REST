package ru.kata.spring.boot_security.demo.dao;

import org.springframework.stereotype.Repository;
import ru.kata.spring.boot_security.demo.models.Role;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.HashSet;
import java.util.Set;

@Repository
public class RoleDAOImpl implements RoleDAO {
    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Set<Role> getAllRoles() {
        return new HashSet<>(entityManager.createQuery("SELECT r FROM Role r", Role.class).getResultList());
    }
}
