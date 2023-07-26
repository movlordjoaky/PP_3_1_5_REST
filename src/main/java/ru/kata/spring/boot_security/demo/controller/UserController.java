package ru.kata.spring.boot_security.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.services.UserService;

@Controller
public class UserController {
    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    // вывод всех пользователей
//    @GetMapping(value = "/")
//    public String printUsers(Model model) {
//        model.addAttribute("users", userService.getAllUsers());
//        return "index";
//    }

    // страница добавления пользователя
//    @GetMapping(value = "/add")
//    public String addUserForm(@ModelAttribute("user") User user) {
//        return "add";
//    }

    // команда на форме добавления пользователя
//    @PostMapping()
//    public String addUser(@ModelAttribute User user) {
//        userService.addUser(user);
//        return "redirect:/";
//    }

//    @GetMapping(value = "/edit/{id}")
//    public String changeUserForm(Model model, @PathVariable int id) {
//        model.addAttribute("user", userService.getUserById(id));
//        return "change";
//    }

//    @PatchMapping(value = "/{id}")
//    public String changeUser(@ModelAttribute User user, @PathVariable int id) {
//        userService.changeUser(user, id);
//        return "redirect:/";
//    }

//    @DeleteMapping("/{id}")
//    public String deleteUser(@PathVariable int id) {
//        userService.deleteUserById(id);
//        return "redirect:/";
//    }
}
