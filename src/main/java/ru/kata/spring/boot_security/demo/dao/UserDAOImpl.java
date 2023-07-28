package ru.kata.spring.boot_security.demo.dao;

//import jakarta.persistence.EntityManager;
//import jakarta.persistence.PersistenceContext;
//import jakarta.persistence.TypedQuery;

import org.springframework.stereotype.Repository;
import ru.kata.spring.boot_security.demo.model.User;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import java.util.List;

@Repository
public class UserDAOImpl implements UserDAO {
    @PersistenceContext
    private EntityManager entityManager;

    public UserDAOImpl() {
    }

    public User findByUsername(String username) {
        return null;
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
        entityManager.persist(user);
    }

    @Override
    public void changeUser(User newUser, int id) {
        User user = entityManager.find(User.class, id);
        user.setName(newUser.getName());
        user.setAge(newUser.getAge());
        user.setSkill(newUser.getSkill());
        entityManager.merge(user);
    }

    @Override
    public void deleteUserById(int id) {
        User user = entityManager.find(User.class, id);
        entityManager.remove(user);
    }
}
