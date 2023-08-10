package ru.kata.spring.boot_security.demo.models;

public class HtmlResponse {
    private String html;
    private User user;

    public HtmlResponse() {
    }

    public HtmlResponse(String html, User user) {
        this.html = html;
        this.user = user;
    }

    public String getHtml() {
        return html;
    }

    public void setHtml(String html) {
        this.html = html;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
