package ru.kata.spring.boot_security.demo.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class LoginController {
    @GetMapping("/login")
    public String loginForm(Model model, String error) {
        if (error != null) {
            model.addAttribute("errorMessage", "Неверное имя пользователя или пароль");
        }
        return "index";
    }

    @GetMapping("/logout")
    public String logout() {
        return "index";
    }
}
