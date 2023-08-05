package ru.kata.spring.boot_security.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.services.RoleService;
import ru.kata.spring.boot_security.demo.services.UserService;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

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
//    @GetMapping(value = "/user/{id}")
    @GetMapping(value = "/user")
//    public String printUser(HttpServletRequest request, Model model, @PathVariable int id) {
    public String printUser(HttpServletRequest request, Model model) {
//        model.addAttribute("request", request);
        HttpSession session = request.getSession();
        User user = (User) session.getAttribute("user");
//        model.addAttribute("user", userService.getUserById(id));
        model.addAttribute("user", user);
        return "common-user";
    }

    // страница добавления пользователя
    @GetMapping(value = "/add")
    public String addUserForm() {
        return "add";
    }

    @GetMapping(value = "/edit/{id}")
    public String editUserForm(Model model, @PathVariable int id) {
        model.addAttribute("user", userService.getUserById(id));
        model.addAttribute("allRoles", roleService.getAllRoles());
        return "edit";
    }
}
