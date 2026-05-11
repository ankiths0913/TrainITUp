package com.trainitup.backend.controller;

import com.trainitup.backend.model.User;
import com.trainitup.backend.repository.UserRepository;
import com.trainitup.backend.repository.CourseRepository;
import com.trainitup.backend.repository.EnrollmentRepository;
import com.trainitup.backend.dto.LoginRequest;
import com.trainitup.backend.dto.RegistrationRequest;
import com.trainitup.backend.util.JwtTokenProvider;
import com.trainitup.backend.exception.DuplicateResourceException;
import com.trainitup.backend.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "User authentication and registration endpoints")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    // --- DASHBOARD STATISTICS (For Super Admin) ---
    @GetMapping("/stats")
    @Operation(summary = "Get platform statistics", description = "Returns total users, courses, and enrollments")
    public ResponseEntity<?> getPlatformStats() {
        long userCount = userRepository.count();
        long courseCount = courseRepository.count();
        long enrollmentCount = enrollmentRepository.count();

        // Returning a Map is the easiest way to send simple key-value pairs
        return ResponseEntity.ok(Map.of(
            "totalUsers", userCount,
            "totalCourses", courseCount,
            "totalEnrollments", enrollmentCount
        ));
    }

    @PostMapping("/register")
    @Operation(summary = "Register a new user", description = "Register a new user with username, email, password, and role")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegistrationRequest request) {
        // Check if email already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new DuplicateResourceException("User", "email", request.getEmail());
        }

        // Check if username already exists
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new DuplicateResourceException("User", "username", request.getUsername());
        }

        // Check if phone number is provided and already exists (if it's not null)
        if (request.getPhoneNumber() != null && !request.getPhoneNumber().isEmpty()) {
            if (userRepository.findAll().stream()
                    .anyMatch(u -> u.getPhoneNumber() != null && u.getPhoneNumber().equals(request.getPhoneNumber()))) {
                throw new DuplicateResourceException("User", "phoneNumber", request.getPhoneNumber());
            }
        }

        // Check if googleId is provided and already exists (if it's not null)
        if (request.getGoogleId() != null && !request.getGoogleId().isEmpty()) {
            if (userRepository.findAll().stream()
                    .anyMatch(u -> u.getGoogleId() != null && u.getGoogleId().equals(request.getGoogleId()))) {
                throw new DuplicateResourceException("User", "googleId", request.getGoogleId());
            }
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword())); 
        user.setRole(request.getRole().toUpperCase());

        // Set optional fields if provided
        if (request.getPhoneNumber() != null && !request.getPhoneNumber().isEmpty()) {
            user.setPhoneNumber(request.getPhoneNumber());
        }

        if (request.getGoogleId() != null && !request.getGoogleId().isEmpty()) {
            user.setGoogleId(request.getGoogleId());
        }

        userRepository.save(user);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "User registered successfully!");
        response.put("username", user.getUsername());
        response.put("email", user.getEmail());
        if (user.getPhoneNumber() != null) {
            response.put("phoneNumber", user.getPhoneNumber());
        }
        if (user.getGoogleId() != null) {
            response.put("googleId", user.getGoogleId());
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
 // --- UPDATE USER ROLE ---
    @PutMapping("/users/{id}/toggle-role")
    @Operation(summary = "Toggle user role", description = "Switch user role between STUDENT and TEACHER")
    public ResponseEntity<?> toggleUserRole(@PathVariable Long id) {
        return userRepository.findById(id)
            .map(user -> {
                String currentRole = user.getRole();
                String newRole = currentRole.equals("STUDENT") ? "TEACHER" : "STUDENT";
                
                user.setRole(newRole);
                userRepository.save(user);
                
                Map<String, String> response = new HashMap<>();
                response.put("message", "User is now a " + newRole);
                response.put("role", newRole);
                return ResponseEntity.ok(response);
            })
            .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
    }
    
    @PostMapping("/login")
    @Operation(summary = "User login", description = "Login with username and password to receive JWT token")
    public ResponseEntity<?> loginUser(@Valid @RequestBody LoginRequest loginRequest) {
        System.out.println("--- Login Attempt ---");
        System.out.println("Username received: " + loginRequest.getUsername());

        return userRepository.findByUsername(loginRequest.getUsername())
            .map(user -> {
                boolean isMatch = passwordEncoder.matches(loginRequest.getPassword(), user.getPassword());
                System.out.println("User Found in DB! Password Match: " + isMatch);
                
                if (isMatch) {
                    // Generate JWT token
                    String token = jwtTokenProvider.generateToken(user.getId(), user.getUsername(), user.getRole());
                    
                    Map<String, Object> response = new HashMap<>();
                    response.put("message", "Login successful");
                    response.put("token", token);
                    response.put("userId", user.getId());
                    response.put("username", user.getUsername());
                    response.put("email", user.getEmail());
                    response.put("role", user.getRole());
                    
                    return ResponseEntity.ok(response);
                } else {
                    throw new ResourceNotFoundException("Invalid username or password");
                }
            })
            .orElseThrow(() -> new ResourceNotFoundException("Invalid username or password"));
    }
    
    @GetMapping("/users")
    @Operation(summary = "Get all users", description = "Retrieve list of all users (admin only)")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @DeleteMapping("/users/{id}")
    @Operation(summary = "Delete user", description = "Delete a user by ID")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User", "id", id);
        }
        userRepository.deleteById(id);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "User has been removed from the platform.");
        return ResponseEntity.ok(response);
    }
}