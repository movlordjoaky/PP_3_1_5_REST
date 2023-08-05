package ru.kata.spring.boot_security.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.services.RoleService;
import ru.kata.spring.boot_security.demo.services.UserService;

import javax.servlet.http.HttpServletRequest;

@Controller
public class CommonUserController {
    private final UserService userService;
    private final RoleService roleService;

    @Autowired
    public CommonUserController(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    // вывод обычного пользователя
    @GetMapping(value = "/user/{id}")
    public String printUser(HttpServletRequest request, Model model, @PathVariable int id) {
//        model.addAttribute("request", request);
        model.addAttribute("user", userService.getUserById(id));
        return "common-user";
    }

    // вывод всех пользователей
    @GetMapping(value = "/admin")
    public String printUsers(Model model) {
        model.addAttribute("users", userService.getAllUsers());
        return "admin";
    }

    // страница добавления пользователя
    @GetMapping(value = "/add")
    public String addUserForm() {
        return "add";
    }

    // команда на форме добавления пользователя
    @PostMapping("/add")
    public String addUser(@ModelAttribute User user) {
        userService.addUser(user);
        return "redirect:/admin";
    }

    @GetMapping(value = "/edit/{id}")
    public String editUserForm(Model model, @PathVariable int id) {
        model.addAttribute("user", userService.getUserById(id));
        model.addAttribute("allRoles", roleService.getAllRoles());
        return "edit";
    }

    @PatchMapping(value = "/edit-user/{id}")
    public String editUser(@ModelAttribute User user, @PathVariable int id) {
        userService.changeUser(user, id);
        return "redirect:/admin";
    }

    @DeleteMapping("/delete/{id}")
    public String deleteUser(@PathVariable int id) {
        userService.deleteUserById(id);
        return "redirect:/admin";
    }
}
