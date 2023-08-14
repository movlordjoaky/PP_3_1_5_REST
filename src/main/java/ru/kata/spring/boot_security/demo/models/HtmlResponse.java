package ru.kata.spring.boot_security.demo.models;

public class HtmlResponse {
    private String html;
    @SuppressWarnings({"unused", "FieldCanBeLocal"})
    private User user;

    public HtmlResponse() {
    }

    public String getHtml() {
        return html;
    }

    public void setHtml(String html) {
        this.html = html;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
