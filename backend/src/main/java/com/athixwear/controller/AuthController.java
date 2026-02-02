package com.athixwear.controller;

import com.athixwear.dto.ForgotPasswordRequest;
import com.athixwear.dto.LoginRequest;
import com.athixwear.dto.LoginResponse;
import com.athixwear.dto.RegisterRequest;
import com.athixwear.dto.RegisterResponse;
import com.athixwear.dto.ResetPasswordRequest;
import com.athixwear.repository.UserRepository;
import com.athixwear.security.JwtService;
import com.athixwear.service.AuthService;
import com.athixwear.service.PasswordResetService;
import com.athixwear.service.RegisterService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

import java.util.Map;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AuthController {

    private final AuthService authService;
    private final RegisterService registerService;
    private final PasswordResetService passwordResetService;
    private final JwtService jwtService;
    private final UserRepository userRepository;

    public AuthController(
    		AuthService authService, 
    		RegisterService registerService,
			PasswordResetService passwordResetService, 
			JwtService jwtService, 
			UserRepository userRepository) {
		super();
		this.authService = authService;
		this.registerService = registerService;
		this.passwordResetService = passwordResetService;
		this.jwtService = jwtService;
		this.userRepository = userRepository;
	}

    // ---------------- LOGIN ----------------
	@PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletResponse response) {

        LoginResponse login = authService.login(request);

        ResponseCookie cookie = ResponseCookie.from("JWT_TOKEN", login.getToken())
                .httpOnly(true)
                .path("/")
                .maxAge(3600)
                .sameSite("Lax")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        return ResponseEntity.ok(login);
    }
	
	// ---------------- REGISTER ----------------
    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(
            @Valid @RequestBody RegisterRequest request) {

        return ResponseEntity.ok(registerService.register(request));
    }
    
    // ---------------- VERIFY AUTH ----------------
    @GetMapping("/verify")
    public ResponseEntity<?> verify(HttpServletRequest request) {

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
                    .map(user -> ResponseEntity.ok(Map.of(
                            "authenticated", true,
                            "username", user.getUsername(),
                            "email", user.getEmail(),
                            "role", user.getRole().name()
                    )))
                    .orElse(ResponseEntity.status(401).body(Map.of(
                            "authenticated", false,
                            "message", "User not found"
                    )));
        }

        return ResponseEntity.status(401).body(Map.of(
                "authenticated", false,
                "message", "Invalid or expired token"
        ));
    }
    
    // ---------------- LOGOUT ----------------
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {

        ResponseCookie cookie = ResponseCookie.from("JWT_TOKEN", "")
                .httpOnly(true)
                .path("/")
                .maxAge(0)
                .sameSite("Lax")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }
    
    // ---------------- FORGOT PASSWORD ----------------
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request) {

        passwordResetService.forgotPassword(request);
        return ResponseEntity.ok(Map.of("message", "Password reset email sent"));
    }
    
    // ---------------- RESET PASSWORD ----------------
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {

        passwordResetService.resetPassword(request);
        return ResponseEntity.ok(Map.of("message", "Password reset successful"));
    }
}
