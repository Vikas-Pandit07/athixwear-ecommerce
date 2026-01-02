package com.athixwear.controller;

import com.athixwear.entity.User;
import com.athixwear.repository.UserRepository;
import com.athixwear.security.JwtService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthCheckController {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    public AuthCheckController(JwtService jwtService, UserRepository userRepository) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @GetMapping("/verify")
    public ResponseEntity<?> verifyAuth(HttpServletRequest request) {
        String token = null;
        
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("JWT_TOKEN".equals(cookie.getName())) {
                    token = cookie.getValue();
                    break;
                }
            }
        }

        if (token != null && jwtService.isTokenValid(token)) {
            String username = jwtService.extractUsername(token);
            return userRepository.findByUsername(username)
                    .map(user -> ResponseEntity.ok().body(Map.of(
                            "authenticated", true,
                            "username", user.getUsername(),
                            "email", user.getEmail(),
                            "role", user.getRole().name()
                    )))
                    .orElseGet(() -> ResponseEntity.status(401).body(Map.of(
                            "authenticated", false,
                            "message", "User not found"
                    )));
        }

        return ResponseEntity.status(401).body(Map.of(
                "authenticated", false,
                "message", "Invalid or expired token"
        ));
    }
}