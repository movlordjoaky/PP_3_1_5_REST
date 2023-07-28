package ru.kata.spring.boot_security.demo.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.kata.spring.boot_security.demo.dao.UserDAO;
import ru.kata.spring.boot_security.demo.dao.UserDAOImpl;
import ru.kata.spring.boot_security.demo.model.User;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class UserServiceImpl implements UserService, UserDetailsService {
    private final UserDAO userDAOImpl;

    @Autowired
    public UserServiceImpl(UserDAO userDAOImpl) {
        this.userDAOImpl = userDAOImpl;
    }

    @Override
    public List<User> getAllUsers() {

        return userDAOImpl.getAllUsers();
    }

    @Override
    public User getUserById(int id) {
        return userDAOImpl.getUserById(id);
    }

    @Override
    @Transactional
    public void addUser(User user) {
        userDAOImpl.addUser(user);
    }

    @Override
    @Transactional
    public void changeUser(User newUser, int id) {
        userDAOImpl.changeUser(newUser, id);
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
            return user;
        }
    }
}
