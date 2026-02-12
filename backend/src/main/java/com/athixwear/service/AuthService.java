package com.athixwear.service;

import com.athixwear.dto.LoginRequest;
import com.athixwear.dto.LoginResponse;
import com.athixwear.entity.User;
import com.athixwear.exception.InvalidCredentialsException;
import com.athixwear.repository.UserRepository;
import com.athixwear.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder encoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder encoder,
                       JwtService jwtService) {
        this.userRepository = userRepository;
        this.encoder = encoder;
        this.jwtService = jwtService;
    }

    public LoginResponse login(LoginRequest request) {

        User user = userRepository.findByUsernameOrEmail(
                request.getUsernameOrEmail(),
                request.getUsernameOrEmail()
        ).orElseThrow(() ->
                new InvalidCredentialsException("Invalid username or password"));

        if (!encoder.matches(request.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid username or password");
        }

        if (!user.isActive()) {
            throw new InvalidCredentialsException("Account is deactivated");
        }

        String token = jwtService.generateToken(user.getUsername());
        return new LoginResponse(user.getUsername(), user.getEmail(), token);
    }

    public Map<String, Object> verifyToken(String token) {
        if (token == null || !jwtService.isTokenValid(token)) {
            throw new InvalidCredentialsException("Invalid or expired token");
        }

        String username = jwtService.extractUsername(token);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new InvalidCredentialsException("User not found"));

        return Map.of(
                "authenticated", true,
                "username", user.getUsername(),
                "email", user.getEmail(),
                "role", user.getRole().name()
        );
    }
}
