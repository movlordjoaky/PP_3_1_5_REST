package ru.kata.spring.boot_security.demo.services;

import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.kata.spring.boot_security.demo.dao.UserDAO;
import ru.kata.spring.boot_security.demo.models.User;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class UserServiceImpl implements UserService {
    private final UserDAO userDAOImpl;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserServiceImpl(UserDAO userDAOImpl, @Lazy PasswordEncoder passwordEncoder) {
        this.userDAOImpl = userDAOImpl;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public List<User> getAllUsers() {

        return userDAOImpl.getAllUsers();
    }

    @Override
    @Transactional
    public User addUser(User user) {
        String newPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(newPassword);
        return userDAOImpl.addUser(user);
    }

    @Override
    @Transactional
    public User changeUser(User newUser) {
        String newPassword = passwordEncoder.encode(newUser.getPassword());
        newUser.setPassword(newPassword);
        return userDAOImpl.changeUser(newUser);
    }

    @Override
    @Transactional
    public void deleteUserById(int id) {
        userDAOImpl.deleteUserById(id);
    }

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userDAOImpl.findByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException(String.format("Пользователь %s не найден", username));
        } else {
            Hibernate.initialize(user.getAuthorities());
            return user;
        }
    }
}
