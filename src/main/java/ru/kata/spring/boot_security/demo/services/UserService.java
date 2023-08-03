package ru.kata.spring.boot_security.demo.services;

import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.transaction.annotation.Transactional;
import ru.kata.spring.boot_security.demo.models.User;

import java.util.List;

public interface UserService extends UserDetailsService {
    List<User> getAllUsers();

    User getUserById(int id);

    @Transactional
    void addUser(User user);

    @Transactional
    void changeUser(User newUser, int id);

    @Transactional
    void deleteUserById(int id);
}
