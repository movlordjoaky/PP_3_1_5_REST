package ru.kata.spring.boot_security.demo.model;

//import jakarta.persistence.*;

import javax.persistence.*;
import java.util.List;

@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String name;

    private int age;

    private double skill;

    @ManyToMany
    private List<Role> roles;

    public User() {
    }

    public User(int id, String name, int age, double skill) {
        this.id = id;
        this.name = name;
        this.age = age;
        this.skill = skill;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public double getSkill() {
        return skill;
    }

    public void setSkill(double skill) {
        this.skill = skill;
    }

    @Override
    public String toString() {
        return id + ". " + name + ", " + age + " лет. Мастерство: " + skill;
    }
}
