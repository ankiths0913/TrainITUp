package com.trainitup.backend.controller;

import com.trainitup.backend.model.Course;
import com.trainitup.backend.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "*")
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
    @PostMapping
    public ResponseEntity<?> createCourse(@RequestBody Course course) {
        Course savedCourse = courseRepository.save(course);
        return ResponseEntity.ok(savedCourse);
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
            return ResponseEntity.internalServerError().body("Error deleting course: " + e.getMessage());
        }
    }
}