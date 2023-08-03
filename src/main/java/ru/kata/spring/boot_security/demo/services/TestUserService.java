package ru.kata.spring.boot_security.demo.services;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;

import java.util.Collections;

@Component
public class TestUserService implements CommandLineRunner {
    private final UserService userService;

    public TestUserService(UserServiceImpl userService) {
        this.userService = userService;
    }

    @Override
    public void run(String... args) {
        Role adminRole = new Role("ROLE_ADMIN");
        Role userRole = new Role("ROLE_USER");

        // ADMIN --- username: petya --- password: pass1
        User user1 = new User("Петя", 16, 8.8, "petya", "pass1");
        user1.setRoles(Collections.singletonList(adminRole));
        userService.addUser(user1);

        // USER --- username: masha --- password: pass2
        User user2 = new User("Маша", 20, 9.8, "masha", "pass2");
        user2.setRoles(Collections.singletonList(userRole));
        userService.addUser(user2);
    }
}
