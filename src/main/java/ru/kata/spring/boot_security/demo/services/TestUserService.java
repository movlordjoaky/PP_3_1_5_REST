package ru.kata.spring.boot_security.demo.services;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import ru.kata.spring.boot_security.demo.models.Role;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.models.UserRole;

import java.util.Collections;
import java.util.Set;

@Component
public class TestUserService implements CommandLineRunner {
    private final UserService userService;

    public TestUserService(UserServiceImpl userService) {
        this.userService = userService;
    }

    @Override
    public void run(String... args) {
        Role adminRole = new Role(UserRole.ADMIN);
        Role commonUserRole = new Role(UserRole.COMMON_USER);

        // ADMIN --- username: petya@email.com --- password: pass1
        User user1 = new User("Петя", "Петров", 16, "petya@email.com", "pass1", Collections.singleton(adminRole));
        userService.addUser(user1);

        // USER --- username: masha@email.com --- password: pass2
        User user2 = new User("Маша", "Машева", 20, "masha@email.com", "pass2", Collections.singleton(commonUserRole));
        userService.addUser(user2);

        // USER --- username: katya@email.com --- password: pass3
        User user3 = new User("Катя", "Катина", 50, "katya@email.com", "pass3", Set.of(adminRole, commonUserRole));
        userService.addUser(user3);

        // USER --- username: vasya@email.com --- password: pass4
        User user4 = new User("Вася", "Васин", 83, "vasya@email.com", "pass4", Collections.singleton(commonUserRole));
        userService.addUser(user4);
    }
}
