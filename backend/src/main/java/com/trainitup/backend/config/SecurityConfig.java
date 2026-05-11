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
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.Arrays;

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
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // ========================================
                // CORS PREFLIGHT REQUESTS
                // ========================================
                // Allow all OPTIONS requests for CORS preflight
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                
                // ========================================
                // PUBLIC ENDPOINTS (No Authentication)
                // ========================================
                // Authentication endpoints
                .requestMatchers(HttpMethod.POST, "/api/auth/register").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
                
                // Public API Documentation
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/swagger-ui.html").permitAll()
                
                // File upload endpoint - Public access for course file uploads
                .requestMatchers(HttpMethod.POST, "/api/courses/upload").permitAll()
                
                // Uploaded files - Public read access
                .requestMatchers(HttpMethod.GET, "/uploads/**").permitAll()
                
                // ========================================
                // PUBLIC MARKETPLACE (Read-Only Access)
                // ========================================
                // Course marketplace - Anyone can browse all courses
                .requestMatchers(HttpMethod.GET, "/api/courses/all").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/courses/{id}").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/courses/category/{category}").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/courses/level/{level}").permitAll()
                
                // Enrollment status check - Public (for frontend logic)
                .requestMatchers(HttpMethod.GET, "/api/enrollments/check").permitAll()
                
                // Public statistics - Anonymous users can see platform stats
                .requestMatchers(HttpMethod.GET, "/api/auth/stats").permitAll()
                
                // ========================================
                // ADMIN ONLY ENDPOINTS (STRICTLY PROTECTED)
                // ========================================
                // User management - ADMIN ONLY
                .requestMatchers(HttpMethod.GET, "/api/auth/users").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/auth/users/{id}").hasRole("ADMIN")
                
                // User role management - ADMIN ONLY (no permit)
                .requestMatchers(HttpMethod.PUT, "/api/auth/users/{id}/toggle-role").hasRole("ADMIN")
                
                // Order deletion - ADMIN ONLY
                .requestMatchers(HttpMethod.DELETE, "/api/orders/{orderId}").hasRole("ADMIN")
                
                // ========================================
                // TEACHER/ADMIN ENDPOINTS (STRICTLY PROTECTED)
                // ========================================
                // Course creation - TEACHER/ADMIN ONLY (no public create)
                .requestMatchers(HttpMethod.POST, "/api/courses/add").hasAnyRole("TEACHER", "ADMIN")
                
                // Course updates - TEACHER/ADMIN ONLY (no public edit)
                .requestMatchers(HttpMethod.PUT, "/api/courses/{id}").hasAnyRole("TEACHER", "ADMIN")
                
                // Course deletion - TEACHER/ADMIN ONLY (no public delete)
                .requestMatchers(HttpMethod.DELETE, "/api/courses/{id}").hasAnyRole("TEACHER", "ADMIN")
                
                // Teacher's own courses - TEACHER/ADMIN ONLY
                .requestMatchers(HttpMethod.GET, "/api/courses/teacher/{teacherId}").hasAnyRole("TEACHER", "ADMIN")
                
                // Quiz publishing - TEACHER/ADMIN ONLY
                .requestMatchers(HttpMethod.POST, "/api/quiz-results/publish").hasAnyRole("TEACHER", "ADMIN")
                
                // Quiz result management - TEACHER/ADMIN ONLY
                .requestMatchers(HttpMethod.PUT, "/api/quiz-results/{resultId}").hasAnyRole("TEACHER", "ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/quiz-results/{resultId}").hasAnyRole("TEACHER", "ADMIN")
                
                // Teacher dashboard - TEACHER/ADMIN ONLY
                .requestMatchers(HttpMethod.GET, "/api/quiz-results/teacher/{teacherId}").hasAnyRole("TEACHER", "ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/quiz-results/stats/teacher/{teacherId}").hasAnyRole("TEACHER", "ADMIN")
                
                // Order status updates - TEACHER/ADMIN ONLY
                .requestMatchers(HttpMethod.PUT, "/api/orders/{orderId}/status").hasAnyRole("TEACHER", "ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/orders/stats/dashboard").hasAnyRole("TEACHER", "ADMIN")
                
                // ========================================
                // AUTHENTICATED USER ENDPOINTS (Login Required)
                // ========================================
                // Course enrollment - Authenticated users only
                .requestMatchers(HttpMethod.POST, "/api/enrollments/join").authenticated()
                
                // User's enrolled courses - Authenticated users only
                .requestMatchers(HttpMethod.GET, "/api/enrollments/user/{userId}").authenticated()
                
                // Student quiz results - Authenticated users only
                .requestMatchers(HttpMethod.GET, "/api/quiz-results/student/{studentId}").authenticated()
                
                // Student order history - Authenticated users only
                .requestMatchers(HttpMethod.GET, "/api/orders/student/{userId}").authenticated()
                .requestMatchers(HttpMethod.GET, "/api/orders/student/{userId}/status/{status}").authenticated()
                
                // Order creation - Authenticated users only
                .requestMatchers(HttpMethod.POST, "/api/orders/create").authenticated()
                
                // ========================================
                // DEFAULT: DENY ALL OTHER REQUESTS
                // ========================================
                // All other requests require authentication
                .anyRequest().authenticated()
            );

        // Add JWT filter before processing requests
        http.addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public UrlBasedCorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Added 5500 and 5501 to cover all VS Code Live Server possibilities
        configuration.setAllowedOrigins(Arrays.asList(
            "http://127.0.0.1:5500", "http://localhost:5500",
            "http://127.0.0.1:5501", "http://localhost:5501"
        ));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}