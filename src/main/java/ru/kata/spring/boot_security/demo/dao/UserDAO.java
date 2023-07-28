package ru.kata.spring.boot_security.demo.dao;

import ru.kata.spring.boot_security.demo.model.User;

import java.util.List;

public interface UserDAO {
    List<User> getAllUsers();

    User getUserById(int id);

    void addUser(User user);

    void changeUser(User newUser, int id);

    void deleteUserById(int id);

    public User findByUsername(String username);
}
