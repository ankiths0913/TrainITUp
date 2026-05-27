package com.trainitup.backend.config;

import com.trainitup.backend.util.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.config.Customizer;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // 1. Enable CORS so React can talk to Spring Boot
            .cors(Customizer.withDefaults())
            
            // 2. Disable CSRF (Standard practice for JWT/REST APIs)
            .csrf(csrf -> csrf.disable())
            
            // 3. Use stateless session management (Perfect for React SPA with JWT)
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            
            // 4. Configure authorization rules
            .authorizeHttpRequests(auth -> auth
                // Allow all OPTIONS requests for CORS preflight
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                
                // Public endpoints - Anyone can access these
                .requestMatchers("/api/auth/**").permitAll()                          // Register/Login
                .requestMatchers(HttpMethod.GET, "/api/courses").permitAll()         // Browse courses
                .requestMatchers(HttpMethod.GET, "/api/courses/teacher/**").permitAll()  // Teacher courses
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/swagger-ui.html").permitAll()  // API docs
                .requestMatchers(HttpMethod.GET, "/uploads/**").permitAll()          // Uploaded files
                .requestMatchers("/api/auth/stats").permitAll()                      // Platform stats
                
                // All other requests require authentication
                .anyRequest().authenticated()
            );
        
        // Add JWT filter before processing requests
        http.addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
}