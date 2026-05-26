package com.trainitup.backend.controller;

import com.trainitup.backend.model.Enrollment;
import com.trainitup.backend.model.Course;
import com.trainitup.backend.repository.EnrollmentRepository;
import com.trainitup.backend.exception.DuplicateResourceException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/enrollments")
@Tag(name = "Enrollments", description = "Course enrollment management endpoints")
public class EnrollmentController {

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private com.trainitup.backend.repository.CourseRepository courseRepository;

    @PostMapping("/join")
    @Operation(summary = "Enroll in a course", description = "Enroll a student in a course")
    public ResponseEntity<?> enrollInCourse(@RequestBody Enrollment enrollment) {
        // Validate required fields
        if (enrollment.getUserId() == null || enrollment.getCourseId() == null) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "userId and courseId are required");
            return ResponseEntity.badRequest().body(error);
        }

        // Check if they are already enrolled
        if (enrollmentRepository.findByUserIdAndCourseId(
                enrollment.getUserId(), enrollment.getCourseId()).isPresent()) {
            throw new DuplicateResourceException("You are already enrolled in this course!");
        }

        // Save the new enrollment
        enrollmentRepository.save(enrollment);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Successfully joined the course!");
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/check")
    @Operation(summary = "Check enrollment status", description = "Check if a user is enrolled in a course")
    public ResponseEntity<?> checkEnrollment(@RequestParam Long userId, @RequestParam Long courseId) {
        boolean isEnrolled = enrollmentRepository.findByUserIdAndCourseId(userId, courseId).isPresent();
        
        Map<String, Object> response = new HashMap<>();
        response.put("enrolled", isEnrolled);
        response.put("userId", userId);
        response.put("courseId", courseId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get user's enrolled courses", description = "Retrieve all courses a user is enrolled in")
    public ResponseEntity<?> getMyCourses(@PathVariable Long userId) {
        // Optimized single database query that joins Enrollment with Course
        // Much more efficient than: 
        //   1. Query enrollments by userId
        //   2. Extract courseIds in memory  
        //   3. Query courses by courseIds
        List<Course> enrolledCourses = enrollmentRepository.findEnrolledCoursesByUserId(userId);
        
        // Handle empty enrollment list
        if (enrolledCourses.isEmpty()) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "User has not enrolled in any courses yet");
            response.put("courses", List.of());
            return ResponseEntity.ok(response);
        }
        
        return ResponseEntity.ok(enrolledCourses);
    }
}
