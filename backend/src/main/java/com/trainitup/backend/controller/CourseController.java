package com.trainitup.backend.controller;

import com.trainitup.backend.model.Course;
import com.trainitup.backend.repository.CourseRepository;
import com.trainitup.backend.dto.CreateCourseRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    @Autowired
    private CourseRepository courseRepository;

    // 1. GET ALL COURSES (For Super Admin)
    @GetMapping
    public ResponseEntity<?> getAllPlatformCourses() {
        try {
            List<Course> allCourses = courseRepository.findAll();
            return ResponseEntity.ok(allCourses);
        } catch (Exception e) {
            e.printStackTrace(); 
            return ResponseEntity.internalServerError().body(Map.of("error", "Error fetching courses: " + e.getMessage()));
        }
    }

    // 2. GET COURSES BY TEACHER ID (For Teacher Dashboard)
    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<List<Course>> getCoursesByTeacher(@PathVariable Long teacherId) {
        List<Course> courses = courseRepository.findByTeacherId(teacherId);
        return ResponseEntity.ok(courses);
    }

    // 3. CREATE COURSE
    @PostMapping("/add")
    public ResponseEntity<?> createCourse(@Valid @RequestBody CreateCourseRequest request) {
        try {
            if (request.getTitle() == null || request.getTitle().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Course title is required"));
            }
            Course course = new Course();
            course.setTitle(request.getTitle());
            course.setSubtitle(request.getSubtitle());
            course.setDescription(request.getDescription());
            course.setCategory(request.getCategory());
            course.setSubCategory(request.getSubCategory());
            course.setLevel(request.getLevel());
            course.setPrice(request.getPrice());
            course.setEducator(request.getEducator());
            course.setLessons(request.getLessons() != null ? request.getLessons() : 0);
            course.setImageUrl(request.getImageUrl());
            course.setVideoUrl(request.getVideoUrl());
            course.setLearningPoints(request.getLearningPoints());
            course.setTeacherId(request.getTeacherId());

            Course savedCourse = courseRepository.save(course);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedCourse);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to create course: " + e.getMessage()));
        }
    }

    // 4. DELETE COURSE (For Super Admin)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCourse(@PathVariable Long id) {
        try {
            if (courseRepository.existsById(id)) {
                courseRepository.deleteById(id);
                return ResponseEntity.ok(Map.of("message", "Course deleted successfully"));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Course not found");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error deleting course: " + e.getMessage());
        }
    }
}