package com.example.backend.controllers;

import com.example.backend.DTO.LoginRequest;
import com.example.backend.DTO.SignupRequest;
import com.example.backend.Entities.User;
import com.example.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest signupRequest) {
        try {
            User user = userService.registerUser(signupRequest.getName(),signupRequest.getEmail(), signupRequest.getPassword());
            return ResponseEntity.ok(Map.of(
                    "message", "User registered successfully",
                    "name", user.getName(),
                    "email", user.getEmail()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        User user = userService.authenticateUser(loginRequest.getEmail(), loginRequest.getPassword());
        if (user != null) {
            // In a real-world scenario, you would generate and return a JWT token here
            return ResponseEntity.ok(Map.of(
                    "message", "Login successful",
                    "name", user.getName(),
                    "email", user.getEmail()
            ));
        }
        return ResponseEntity.badRequest().body("Invalid credentials");
    }
}
