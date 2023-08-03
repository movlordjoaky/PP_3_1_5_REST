package ru.kata.spring.boot_security.demo.dao;

import org.springframework.stereotype.Repository;
import ru.kata.spring.boot_security.demo.models.Role;
import ru.kata.spring.boot_security.demo.models.User;
//import ru.kata.spring.boot_security.demo.repositories.UserRepository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Repository
public class UserDAOImpl implements UserDAO {
    @PersistenceContext
    private EntityManager entityManager;
//    private UserRepository userRepository;

    public UserDAOImpl() {
    }

    public User findByUsername(String username) {
        TypedQuery<User> query = entityManager.createQuery("SELECT user FROM User user WHERE user.username = :username", User.class);
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
    public User getUserById(int id) {
        return entityManager.find(User.class, id);
    }

    @Override
    public void addUser(User user) {
        System.out.println("1222" + user);
        List<String> roleNames = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toList());
        TypedQuery<Role> query = entityManager.createQuery("SELECT r FROM Role r WHERE r.name IN (:rolesNames)", Role.class);
        query.setParameter("rolesNames", roleNames);
        Set<Role> updatedRoles = new HashSet<>(query.getResultList());
        updatedRoles.addAll(user.getRoles());
        user.setRoles(updatedRoles);
        entityManager.persist(user);
    }

    @Override
    public void changeUser(User newUser, int id) {
        System.out.println("newUser" + newUser);
        User oldUser = entityManager.find(User.class, id);
        System.out.println("oldUser" + oldUser);
        newUser.setId(oldUser.getId());
        System.out.println("updatedUser" + newUser);
        List<String> roleNames = newUser.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toList());
        TypedQuery<Role> query = entityManager.createQuery("SELECT r FROM Role r WHERE r.name IN (:rolesNames)", Role.class);
        query.setParameter("rolesNames", roleNames);
        Set<Role> updatedRoles = new HashSet<>(query.getResultList());
        newUser.setRoles(updatedRoles);
        entityManager.merge(newUser);
    }

    @Override
    public void deleteUserById(int id) {
        User user = entityManager.find(User.class, id);
        entityManager.remove(user);
    }
}
