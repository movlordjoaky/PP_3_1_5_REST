package ru.kata.spring.boot_security.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.services.UserService;
import ru.kata.spring.boot_security.demo.services.RoleService;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

@Controller
public class AdminController {
    private final UserService userService;
    private final RoleService roleService;

    @Autowired
    public AdminController(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    // вывод админа
    @GetMapping(value = "/admin")
    public String printUser(HttpServletRequest request, Model model) {
        HttpSession session = request.getSession();
        User user = (User) session.getAttribute("user");
        model.addAttribute("user", user);
        model.addAttribute("users", userService.getAllUsers());
        model.addAttribute("roles", roleService.getAllRoles());
        return "admin";
    }

    // команда на форме добавления пользователя
    @PostMapping("/api/users")
    @ResponseBody
    public User createUser(@RequestBody User user) {
        System.out.println(user);
        User newUser = userService.addUser(user);
        newUser.setPassword("");
        return newUser;
    }

    @PatchMapping("/api/users")
    @ResponseBody
    public User editUser(@RequestBody User user) {
        System.out.println("PatchMapping1234");
        User newUser = userService.changeUser(user);
        System.out.println(newUser);
        return newUser;
    }

    @DeleteMapping("/delete-user/{id}")
    public String deleteUser(@PathVariable int id) {
        userService.deleteUserById(id);
        return "redirect:/admin";
    }
}
