package com.athixwear.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.athixwear.dto.RegisterRequest;
import com.athixwear.dto.RegisterResponse;
import com.athixwear.service.RegisterService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.PostMapping;


@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class RegisterController {

	private final RegisterService service;

	public RegisterController(RegisterService service) {
		super();
		this.service = service;
	}
	
	@PostMapping("/register")
	public ResponseEntity<RegisterResponse> registerUser(@Valid @RequestBody RegisterRequest request) {
		
		return ResponseEntity.ok(service.register(request));
		
	}
}
