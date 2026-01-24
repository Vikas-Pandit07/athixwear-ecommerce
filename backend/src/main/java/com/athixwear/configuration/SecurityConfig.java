package com.athixwear.configuration;

import com.athixwear.security.JwtFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(sm -> sm
            		.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
            		.requestMatchers(
            				 "/api/auth/login",
            				    "/api/auth/register",
            				    "/api/auth/forgot-password",      
            				    "/api/auth/reset-password",      
            				    "/api/auth/verify",
            				    "/api/products/**"
            		).permitAll()
            		 // Admin endpoints - require ADMIN role
                    .requestMatchers("/api/admin/**").hasRole("ADMIN")
                    
                    // User endpoints - require authentication
                    .requestMatchers("/api/user/**", "/api/cart/**", "/api/orders/**").authenticated()
                    
                    // All other requests need authentication
                    .anyRequest().authenticated()
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
