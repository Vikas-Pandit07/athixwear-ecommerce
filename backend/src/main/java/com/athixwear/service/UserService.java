package com.athixwear.service;

import com.athixwear.dto.ChangePasswordRequest;
import com.athixwear.dto.ProfileResponse;
import com.athixwear.dto.UpdateProfileRequest;
import com.athixwear.entity.User;
import com.athixwear.exception.InvalidCredentialsException;
import com.athixwear.repository.UserRepository;
import com.athixwear.exception.ResourceNotFoundException;
import com.athixwear.exception.UserAlreadyExistsException;
import com.athixwear.security.JwtService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
public class UserService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    
    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }
    
    public User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new ResourceNotFoundException("User not authenticated");
        }
        
        String username = auth.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
    
    public Integer getCurrentUserId() {
        return getCurrentUser().getUserId();
    }
    
    public boolean isAdmin() {
        User user = getCurrentUser();
        return user.getRole().name().equals("ADMIN");
    }

    public ProfileResponse getProfile() {
        User user = getCurrentUser();

        ProfileResponse response = new ProfileResponse();
        response.setUserId(user.getUserId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole().name());
        response.setJoinDate("Member since 2024");
        return response;
    }

    public Optional<String> updateProfile(UpdateProfileRequest request) {
        User user = getCurrentUser();

        if (!user.getUsername().equals(request.getUsername())
                && userRepository.existsByUsername(request.getUsername())) {
            throw new UserAlreadyExistsException("Username already taken");
        }

        if (!user.getEmail().equals(request.getEmail())
                && userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException("Email already registered");
        }

        boolean usernameChanged = !user.getUsername().equals(request.getUsername());
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        userRepository.save(user);

        if (!usernameChanged) {
            return Optional.empty();
        }

        String newToken = jwtService.generateToken(user.getUsername());
        return Optional.of(newToken);
    }

    public void changePassword(ChangePasswordRequest request) {
        User user = getCurrentUser();

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Current password incorrect");
        }

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new InvalidCredentialsException("Passwords do not match");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    public Map<String, Object> checkRole() {
        User user = getCurrentUser();
        return Map.of(
                "authenticated", true,
                "username", user.getUsername(),
                "isAdmin", user.getRole().name().equals("ADMIN")
        );
    }
}
