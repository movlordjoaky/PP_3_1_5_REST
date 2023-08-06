package ru.kata.spring.boot_security.demo.dao;

import ru.kata.spring.boot_security.demo.models.User;

import java.util.List;

public interface UserDAO {
    List<User> getAllUsers();

    User getUserById(int id);

    User addUser(User user);

    User changeUser(User newUser);

    void deleteUserById(int id);

    User findByUsername(String username);
}
