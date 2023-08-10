package ru.kata.spring.boot_security.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import ru.kata.spring.boot_security.demo.models.HtmlResponse;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.models.UserRole;
import ru.kata.spring.boot_security.demo.services.RoleService;
import ru.kata.spring.boot_security.demo.services.UserService;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.Map;

@Controller
public class LoginController {
    private final UserService userService;
    private final RoleService roleService;
    private final AuthenticationManager authenticationManager;
    private final TemplateEngine templateEngine;

    @Autowired
    public LoginController(UserService userService, RoleService roleService, AuthenticationManager authenticationManager, TemplateEngine templateEngine) {
        this.userService = userService;
        this.roleService = roleService;
        this.authenticationManager = authenticationManager;
        this.templateEngine = templateEngine;
    }

    @PostMapping("/login")
    @ResponseBody
    public ResponseEntity<HtmlResponse> login(@RequestBody Map<String, String> loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.get("username"), loginRequest.get("password"))
        );
        HtmlResponse response = new HtmlResponse();
        SecurityContextHolder.getContext().setAuthentication(authentication);
        User user = (User) authentication.getPrincipal();
        Context context = new Context();
        if (user.hasRole(UserRole.ADMIN) || user.hasRole(UserRole.COMMON_USER)) {
            response.setUser(user);
            if (user.hasRole(UserRole.COMMON_USER)) {
                context.setVariable("user", user);
            }
            if (user.hasRole(UserRole.ADMIN)) {
                context.setVariable("users", userService.getAllUsers());
                context.setVariable("roles", roleService.getAllRoles());
            }
            response.setHtml(templateEngine.process("user", context));
            return ResponseEntity.ok().body(response);
        } else {
            response.setHtml(templateEngine.process("index", context));
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    @PostMapping("/logout-custom")
    @ResponseBody
    public String logout(HttpServletRequest request, HttpServletResponse response) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("authCookie")) {
                    cookie.setMaxAge(0);
                    response.addCookie(cookie);
                    break;
                }
            }
        }
        Context context = new Context();
        return templateEngine.process("index", context);
    }
}
