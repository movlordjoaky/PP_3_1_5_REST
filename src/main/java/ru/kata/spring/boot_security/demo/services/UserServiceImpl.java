package ru.kata.spring.boot_security.demo.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.kata.spring.boot_security.demo.dao.UserDAO;
import ru.kata.spring.boot_security.demo.model.User;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class UserServiceImpl implements UserService {
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
}
