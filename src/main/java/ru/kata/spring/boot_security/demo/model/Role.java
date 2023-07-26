package ru.kata.spring.boot_security.demo.model;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import java.util.List;

@Entity
public class Role {
    @Id
    private Long id;
    private String role;
    @ManyToMany
    List<User> usersWithRole;

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }
}
