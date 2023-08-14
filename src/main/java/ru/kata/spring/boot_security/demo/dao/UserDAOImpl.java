package ru.kata.spring.boot_security.demo.dao;

import org.springframework.stereotype.Repository;
import ru.kata.spring.boot_security.demo.models.Role;
import ru.kata.spring.boot_security.demo.models.User;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Repository
public class UserDAOImpl implements UserDAO {
    @PersistenceContext
    private EntityManager entityManager;

    public UserDAOImpl() {
    }

    public User findByUsername(String username) {
        TypedQuery<User> query = entityManager.createQuery("SELECT user FROM User user WHERE user.email = :username", User.class);
        query.setParameter("username", username);
        List<User> users = query.getResultList();
        if (users.isEmpty()) {
            return null;
        } else {
            return users.get(0);
        }
    }

    @Override
    public List<User> getAllUsers() {
        TypedQuery<User> query = entityManager.createQuery("SELECT user FROM User user", User.class);
        return query.getResultList();
    }

    @Override
    public User addUser(User user) {
        Set<Role> updatedRoles = getRoleNamesFromRoles(user);
        updatedRoles.addAll(user.getRoles());
        user.setRoles(updatedRoles);
        entityManager.persist(user);
        return user;
    }

    @Override
    public User changeUser(User newUser) {
        newUser.setRoles(getRoleNamesFromRoles(newUser));
        return entityManager.merge(newUser);
    }

    private Set<Role> getRoleNamesFromRoles(User user) {
        List<String> roleNames = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toList());
        TypedQuery<Role> query = entityManager.createQuery("SELECT r FROM Role r WHERE r.name IN (:rolesNames)", Role.class);
        query.setParameter("rolesNames", roleNames);
        return new HashSet<>(query.getResultList());
    }

    @Override
    public void deleteUserById(int id) {
        User user = entityManager.find(User.class, id);
        entityManager.remove(user);
    }
}
