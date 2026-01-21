package com.athixwear.controller;

import java.util.Map;

import org.apache.http.auth.InvalidCredentialsException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.athixwear.dto.ForgotPasswordRequest;
import com.athixwear.dto.ResetPasswordRequest;
import com.athixwear.service.PasswordResetService;

import jakarta.validation.Valid;

@RestController
@CrossOrigin
@RequestMapping("/api/auth")
public class PasswordResetController {
	
	private final PasswordResetService passwordResetService;

	public PasswordResetController(PasswordResetService passwordResetService) {
		super();
		this.passwordResetService = passwordResetService;
	}
	
	// In PasswordResetController.java - Modify forgotPassword method
	@PostMapping("/forgot-password")
	public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
	    try {
	        passwordResetService.forgotPassword(request);
	        return ResponseEntity.ok().body(Map.of("message", "Password reset email sent"));
	    } catch (Exception e) {
	        return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
	    }
	}

	@PostMapping("/reset-password") 
	public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
		
		passwordResetService.resetPassword(request);
			return ResponseEntity.ok().body(Map.of("message", "Password reset successfully"));
	}
}
