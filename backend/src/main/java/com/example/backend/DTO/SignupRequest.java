package com.example.backend.DTO;

public class SignupRequest {
    private String name;
    private String email;
    private String password;

    // Constructor
    public SignupRequest() {}

    public SignupRequest(String name,String email, String password) {
        this.name=name;
        this.email = email;
        this.password = password;
    }

    // Getters and Setters
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}

