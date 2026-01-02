package com.athixwear.service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

import com.athixwear.exception.InvalidCredentialsException;
import com.athixwear.exception.ResourceNotFoundException;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.athixwear.dto.ForgotPasswordRequest;
import com.athixwear.dto.ResetPasswordRequest;
import com.athixwear.entity.PasswordResetToken;
import com.athixwear.entity.User;
import com.athixwear.repository.PasswordResetTokenRepository;
import com.athixwear.repository.UserRepository;

@Service
public class PasswordResetService {
	
	private final UserRepository userRepository;
	private final PasswordResetTokenRepository tokenRepository;
	private final JavaMailSender mailSender;
	private final PasswordEncoder passwordEncoder;
	
	public PasswordResetService(
			UserRepository userRepository, 
			PasswordResetTokenRepository tokenRepository,
			JavaMailSender mailSender, 
			PasswordEncoder passwordEncoder) {
		super();
		this.userRepository = userRepository;
		this.tokenRepository = tokenRepository;
		this.mailSender = mailSender;
		this.passwordEncoder = passwordEncoder;
	}
	
	public void forgotPassword(ForgotPasswordRequest request) {
	    User user = userRepository.findByEmail(request.getEmail())
	            .orElseThrow(() -> new ResourceNotFoundException("Email not found"));
	    
	    // Delete existing tokens
	    tokenRepository.findByUser(user).ifPresent(tokenRepository::delete);
	    
	    // Create new token
	    String token = UUID.randomUUID().toString();
	    PasswordResetToken resetToken = new PasswordResetToken();
	    resetToken.setToken(token);
	    resetToken.setUser(user);
	    resetToken.setExpiryDate(LocalDateTime.now().plusHours(24));
	    resetToken.setUsed(false);
	    
	    tokenRepository.save(resetToken);
	    
	    sendResetEmail(user.getEmail(), token);
	}
	
	public void resetPassword(ResetPasswordRequest request) {
		if (!request.getNewPassword().equals(request.getConfirmPassword())) {
			throw new InvalidCredentialsException("Password do not match");
		}
		
		
		PasswordResetToken resetToken = tokenRepository.findByToken(request.getToken())
							.orElseThrow(() -> new InvalidCredentialsException("Invalid reset token"));
		
		 if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
	            throw new InvalidCredentialsException("Reset token has expired");
	     }
	     
	     if (resetToken.isUsed()) {
	         throw new InvalidCredentialsException("Reset token already used");
	     }
	     
	     
	     User user = resetToken.getUser();
	     user.setPassword(passwordEncoder.encode(request.getNewPassword()));
	     userRepository.save(user);
	     
	     resetToken.setUsed(true);
	     tokenRepository.save(resetToken);
	     
	}
	
	private void sendResetEmail(String toEmail, String token) {
		try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("AthixWear - Password Reset");
            message.setText(
                    "Hello,\n\n" +
                            "You have requested to reset your password for AthixWear.\n\n" +
                            "Click the link below to reset your password:\n" +
                            "http://localhost:5173/reset-password?token=" + token + "\n\n" +
                            "This link will expire in 24 hours.\n\n" +
                            "If you didn't request this, please ignore this email.\n\n" +
                            "Best regards,\n" +
                            "AthixWear Team");
            mailSender.send(message);
        } catch (Exception e) {
            // Log error but don't throw - allow password reset to work even if email fails
            System.err.println("Failed to send email: " + e.getMessage());
        }
	}
}
