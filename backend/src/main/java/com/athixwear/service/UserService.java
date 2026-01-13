package com.athixwear.service;

import com.athixwear.entity.User;
import com.athixwear.repository.UserRepository;
import com.athixwear.exception.ResourceNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    
    private final UserRepository userRepository;
    
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
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
}