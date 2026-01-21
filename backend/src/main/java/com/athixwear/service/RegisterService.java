package com.athixwear.service;

import java.util.Optional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.athixwear.dto.RegisterRequest;
import com.athixwear.dto.RegisterResponse;
import com.athixwear.entity.Cart;
import com.athixwear.entity.Role;
import com.athixwear.entity.User;
import com.athixwear.exception.UserAlreadyExistsException;
import com.athixwear.repository.CartRepository;
import com.athixwear.repository.UserRepository;


@Service
public class RegisterService {

	private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final PasswordEncoder passwordEncoder;
    
    public RegisterService(UserRepository userRepository, 
                          CartRepository cartRepository,
                          PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.cartRepository = cartRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public RegisterResponse register(RegisterRequest request) {
    	
// Check user is exist or not by username and email
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new UserAlreadyExistsException("Username already taken. Please try new one");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException("Email already registered. Please try to login");
        }
        
// Creating entity to store data
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.CUSTOMER);
        user.setActive(true);
       
// Save To DB
        User savedUser = userRepository.save(user);
        
     // Create cart for user
        Cart cart = new Cart();
        cart.setUser(savedUser);
        cartRepository.save(cart);
        
// Map the Entity and return to response DTO
        RegisterResponse response = new RegisterResponse();
        response.setUsername(savedUser.getUsername());
        response.setEmail(savedUser.getEmail());

        return response;
    }
}