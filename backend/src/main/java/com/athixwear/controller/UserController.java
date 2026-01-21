// UserController.java - Add these methods
package com.athixwear.controller;

import com.athixwear.dto.*;
import com.athixwear.entity.User;
import com.athixwear.exception.InvalidCredentialsException;
import com.athixwear.exception.UserAlreadyExistsException;
import com.athixwear.repository.UserRepository;
import com.athixwear.security.JwtService;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.net.http.HttpResponse;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/user")
@CrossOrigin
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    
    public UserController(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
		super();
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
		this.jwtService = jwtService;
	}

	// Get current user profile
    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }

        String username = auth.getName();
        Optional<User> userOpt = userRepository.findByUsername(username);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            ProfileResponse response = new ProfileResponse();
            response.setUserId(user.getUserId());
            response.setUsername(user.getUsername());
            response.setEmail(user.getEmail());
            response.setRole(user.getRole().name());
            
            // Format join date if you have createdAt field in User entity
            // response.setJoinDate(user.getCreatedAt().format(DateTimeFormatter.ofPattern("dd MMM yyyy")));
            response.setJoinDate("Member since 2024"); // Temporary
            
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.status(404).body(Map.of("error", "User not found"));
    }
    
    // Update profile
 // UserController.java - Update the updateProfile method
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            @Valid @RequestBody UpdateProfileRequest request,
            HttpServletResponse response) {  // Add HttpServletResponse parameter
        
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = auth.getName();
        
        User currentUser = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Store old username for token regeneration
        String oldUsername = currentUser.getUsername();
        boolean usernameChanged = !oldUsername.equals(request.getUsername());
        
        // Check if new username is taken by another user
        if (usernameChanged) {
            if (userRepository.existsByUsername(request.getUsername())) {
                throw new UserAlreadyExistsException("Username already taken");
            }
        }
        
        // Check if new email is taken by another user
        if (!currentUser.getEmail().equals(request.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new UserAlreadyExistsException("Email already registered");
            }
        }
        
        // Update user
        currentUser.setUsername(request.getUsername());
        currentUser.setEmail(request.getEmail());
        User updatedUser = userRepository.save(currentUser);
        
        // If username changed, generate new JWT token
        Map<String, Object> responseBody = new HashMap<>();
        responseBody.put("message", "Profile updated successfully");
        
        if (usernameChanged) {
            // Generate new token with new username
            String newToken = jwtService.generateToken(updatedUser.getUsername());
            
            // Set new token in cookie
            ResponseCookie cookie = ResponseCookie.from("JWT_TOKEN", newToken)
                    .httpOnly(true)
                    .path("/")
                    .maxAge(3600)
                    .sameSite("Lax")
                    .build();
            
            response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
            responseBody.put("tokenRegenerated", true);
        }
        
        return ResponseEntity.ok(responseBody);
    }
    
    // Change password
    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Verify current password
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Current password is incorrect");
        }
        
        // Check if new passwords match
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new InvalidCredentialsException("New passwords do not match");
        }
        
        // Check if new password is same as current
        if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("New password cannot be same as current password");
        }
        
        // Update password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        
        return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
    }
    
    // Check role (existing method - keep it)
    @GetMapping("/check-role")
    public ResponseEntity<?> checkUserRole() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(401).body(Map.of("authenticated", false));
        }
        
        String username = auth.getName();
        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_ADMIN"));
        
        return ResponseEntity.ok(Map.of(
            "authenticated", true,
            "username", username,
            "isAdmin", isAdmin
        ));
    }
}