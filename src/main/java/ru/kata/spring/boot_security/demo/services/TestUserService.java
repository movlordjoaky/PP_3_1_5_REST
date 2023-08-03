package ru.kata.spring.boot_security.demo.services;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import ru.kata.spring.boot_security.demo.models.Role;
import ru.kata.spring.boot_security.demo.models.User;

import java.util.Collections;
import java.util.List;
import java.util.Set;

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
        user1.setRoles(Collections.singleton(adminRole));
        userService.addUser(user1);

        // USER --- username: masha --- password: pass2
        User user2 = new User("Маша", 20, 9.8, "masha", "pass2");
        user2.setRoles(Collections.singleton(userRole));
        userService.addUser(user2);

        // USER --- username: katya --- password: pass3
        User user3 = new User("Катя", 50, 6.3, "katya", "pass3");
        user3.setRoles(Set.of(adminRole, userRole));
        userService.addUser(user3);

        // USER --- username: vasya --- password: pass4
        User user4 = new User("Вася", 33, 0.3, "vasya", "pass4");
        user4.setRoles(Collections.singleton(userRole));
        userService.addUser(user4);
    }
}
