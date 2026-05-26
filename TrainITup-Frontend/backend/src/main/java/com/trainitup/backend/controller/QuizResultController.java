package com.trainitup.backend.controller;

import com.trainitup.backend.model.QuizResult;
import com.trainitup.backend.dto.QuizResultRequest;
import com.trainitup.backend.repository.QuizResultRepository;
import com.trainitup.backend.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/quiz-results")
@Tag(name = "Quiz Results", description = "Quiz and exam result management")
public class QuizResultController {
    
    @Autowired
    private QuizResultRepository quizResultRepository;
    
    // 1. PUBLISH QUIZ RESULT (Teacher publishes result)
    @PostMapping("/publish")
    @Operation(summary = "Publish quiz result", description = "Teacher publishes exam/test result for a student")
    public ResponseEntity<?> publishQuizResult(@Valid @RequestBody QuizResultRequest request) {
        try {
            QuizResult result = new QuizResult(
                request.getQuizId(),
                request.getStudentId(),
                request.getTeacherId(),
                request.getExamName(),
                request.getStudentName(),
                request.getStudentEmail(),
                request.getScore(),
                request.getStatus()
            );
            
            result.setFeedback(request.getFeedback());
            result.setPublishedDate(LocalDateTime.now());
            
            quizResultRepository.save(result);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Result published successfully!");
            response.put("resultId", result.getId());
            response.put("grade", result.getGrade());
            response.put("percentage", result.getPercentage());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to publish result: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    // 2. GET STUDENT'S QUIZ RESULTS
    @GetMapping("/student/{studentId}")
    @Operation(summary = "Get student quiz results", description = "Get all quiz results for a student")
    public ResponseEntity<?> getStudentResults(@PathVariable Long studentId) {
        List<QuizResult> results = quizResultRepository.findByStudentId(studentId);
        
        List<Map<String, Object>> response = results.stream().map(result -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", result.getId());
            map.put("examName", result.getExamName());
            map.put("score", result.getScore());
            map.put("percentage", result.getPercentage());
            map.put("grade", result.getGrade());
            map.put("status", result.getStatus());
            map.put("feedback", result.getFeedback());
            map.put("publishedDate", result.getPublishedDate());
            return map;
        }).toList();
        
        return ResponseEntity.ok(response);
    }
    
    // 3. GET TEACHER'S PUBLISHED RESULTS
    @GetMapping("/teacher/{teacherId}")
    @Operation(summary = "Get teacher's published results", description = "Get all results published by a teacher")
    public ResponseEntity<?> getTeacherResults(@PathVariable Long teacherId) {
        List<QuizResult> results = quizResultRepository.findByTeacherId(teacherId);
        
        List<Map<String, Object>> response = results.stream().map(result -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", result.getId());
            map.put("examName", result.getExamName());
            map.put("studentName", result.getStudentName());
            map.put("studentEmail", result.getStudentEmail());
            map.put("score", result.getScore());
            map.put("grade", result.getGrade());
            map.put("status", result.getStatus());
            map.put("publishedDate", result.getPublishedDate());
            return map;
        }).toList();
        
        return ResponseEntity.ok(response);
    }
    
    // 4. GET SINGLE RESULT
    @GetMapping("/{resultId}")
    @Operation(summary = "Get result details", description = "Get detailed information about a quiz result")
    public ResponseEntity<?> getResult(@PathVariable Long resultId) {
        QuizResult result = quizResultRepository.findById(resultId)
            .orElseThrow(() -> new ResourceNotFoundException("Quiz Result", "id", resultId));
        
        Map<String, Object> response = new HashMap<>();
        response.put("id", result.getId());
        response.put("examName", result.getExamName());
        response.put("studentName", result.getStudentName());
        response.put("studentEmail", result.getStudentEmail());
        response.put("score", result.getScore());
        response.put("percentage", result.getPercentage());
        response.put("grade", result.getGrade());
        response.put("status", result.getStatus());
        response.put("feedback", result.getFeedback());
        response.put("publishedDate", result.getPublishedDate());
        
        return ResponseEntity.ok(response);
    }
    
    // 5. GET RESULTS BY STATUS
    @GetMapping("/student/{studentId}/status/{status}")
    @Operation(summary = "Get results by status", description = "Get student results filtered by status (Pass/Fail)")
    public ResponseEntity<?> getResultsByStatus(@PathVariable Long studentId, @PathVariable String status) {
        List<QuizResult> results = quizResultRepository.findByStudentIdAndStatus(studentId, status);
        
        List<Map<String, Object>> response = results.stream().map(result -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", result.getId());
            map.put("examName", result.getExamName());
            map.put("score", result.getScore());
            map.put("grade", result.getGrade());
            map.put("status", result.getStatus());
            map.put("publishedDate", result.getPublishedDate());
            return map;
        }).toList();
        
        return ResponseEntity.ok(response);
    }
    
    // 6. UPDATE RESULT
    @PutMapping("/{resultId}")
    @Operation(summary = "Update quiz result", description = "Update an existing quiz result")
    public ResponseEntity<?> updateResult(@PathVariable Long resultId, @Valid @RequestBody QuizResultRequest request) {
        QuizResult result = quizResultRepository.findById(resultId)
            .orElseThrow(() -> new ResourceNotFoundException("Quiz Result", "id", resultId));
        
        result.setScore(request.getScore());
        result.setStatus(request.getStatus());
        result.setFeedback(request.getFeedback());
        result.setGrade(getGradeFromScore(request.getScore()));
        result.setPercentage(request.getScore());
        
        quizResultRepository.save(result);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Result updated successfully!");
        return ResponseEntity.ok(response);
    }
    
    // 7. DELETE RESULT
    @DeleteMapping("/{resultId}")
    @Operation(summary = "Delete quiz result", description = "Delete a quiz result")
    public ResponseEntity<?> deleteResult(@PathVariable Long resultId) {
        QuizResult result = quizResultRepository.findById(resultId)
            .orElseThrow(() -> new ResourceNotFoundException("Quiz Result", "id", resultId));
        
        quizResultRepository.delete(result);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Result deleted successfully!");
        return ResponseEntity.ok(response);
    }
    
    // 8. GET QUIZ RESULTS (all students for a quiz)
    @GetMapping("/quiz/{quizId}")
    @Operation(summary = "Get quiz results", description = "Get all results for a specific quiz")
    public ResponseEntity<?> getQuizResults(@PathVariable Long quizId) {
        List<QuizResult> results = quizResultRepository.findByQuizId(quizId);
        
        List<Map<String, Object>> response = results.stream().map(result -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", result.getId());
            map.put("studentName", result.getStudentName());
            map.put("studentEmail", result.getStudentEmail());
            map.put("score", result.getScore());
            map.put("grade", result.getGrade());
            map.put("status", result.getStatus());
            return map;
        }).toList();
        
        return ResponseEntity.ok(response);
    }
    
    // 9. GET STATISTICS
    @GetMapping("/stats/teacher/{teacherId}")
    @Operation(summary = "Get teacher statistics", description = "Get statistics for teacher's quiz results")
    public ResponseEntity<?> getTeacherStats(@PathVariable Long teacherId) {
        List<QuizResult> results = quizResultRepository.findByTeacherId(teacherId);
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalResults", results.size());
        stats.put("passed", quizResultRepository.countByStatusAndTeacherId("Pass", teacherId));
        stats.put("failed", quizResultRepository.countByStatusAndTeacherId("Fail", teacherId));
        stats.put("averageScore", results.isEmpty() ? 0 : 
            results.stream().mapToInt(QuizResult::getScore).average().orElse(0.0));
        
        return ResponseEntity.ok(stats);
    }
    
    // Helper method to calculate grade
    private String getGradeFromScore(Integer score) {
        if (score >= 80) return "A";
        if (score >= 70) return "B";
        if (score >= 60) return "C";
        if (score >= 50) return "D";
        return "F";
    }
}
