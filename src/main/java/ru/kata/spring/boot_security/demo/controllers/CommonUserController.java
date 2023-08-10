package ru.kata.spring.boot_security.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.services.RoleService;
import ru.kata.spring.boot_security.demo.services.UserService;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Controller
public class CommonUserController {
    private final UserService userService;
    private final RoleService roleService;
    private final TemplateEngine templateEngine;
    private final AuthenticationManager authenticationManager;

    @Autowired
    public CommonUserController(UserService userService, RoleService roleService, AuthenticationManager authenticationManager, TemplateEngine templateEngine) {
        this.userService = userService;
        this.roleService = roleService;
        this.authenticationManager = authenticationManager;
        this.templateEngine = templateEngine;
    }

    // вывод обычного пользователя
    @ResponseBody
    @GetMapping(value = "/common-user")
    public String getUser(Authentication authentication) {
        Pattern pattern = Pattern.compile("<main>(.*?)</main>", Pattern.DOTALL);

        User user = (User) authentication.getPrincipal();
        Context context = new Context();
        context.setVariable("user", user);
        String html = templateEngine.process("common-user", context);
        Matcher matcher = pattern.matcher(html);
        if (matcher.find()) {
            html = matcher.group(1);
            return html;
        }
        return "error";
    }
}
