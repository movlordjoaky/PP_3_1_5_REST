package ru.kata.spring.boot_security.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
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

    // вывод всех пользователей
//    @GetMapping(value = "/admin")
//    public String printUsers(Model model) {
//        model.addAttribute("users", userService.getAllUsers());
//        return "admin";
//    }
//
    // вывод админа
//    @GetMapping(value = "/admin/{id}")
    @GetMapping(value = "/admin")
    public String printUser(HttpServletRequest request, Model model) {
        HttpSession session = request.getSession();
        User user = (User) session.getAttribute("user");
        model.addAttribute("user", user);
//        model.addAttribute("user", userService.getUserById(id));
        model.addAttribute("users", userService.getAllUsers());
        model.addAttribute("roles", roleService.getAllRoles());
        return "admin";
    }

    // команда на форме добавления пользователя
    @PostMapping("/create")
    public String createUser(@ModelAttribute User user) {
        userService.addUser(user);
        return "redirect:/admin";
    }

    @PatchMapping(value = "/edit-user/{id}")
    public String editUser(@ModelAttribute User user, @PathVariable int id) {
        userService.changeUser(user, id);
        return "redirect:/admin";
    }

    @DeleteMapping("/delete-user/{id}")
    public String deleteUser(@PathVariable int id) {
        userService.deleteUserById(id);
        return "redirect:/admin";
    }
    // вывод всех пользователей
//    @GetMapping(value = "/admin")
//    public String printUsers(Model model) {
//        model.addAttribute("user",userService.get)
//        model.addAttribute("users", userService.getAllUsers());
//        return "admin";
//    }
}
