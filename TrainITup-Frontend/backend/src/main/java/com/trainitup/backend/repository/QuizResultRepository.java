package com.trainitup.backend.repository;

import com.trainitup.backend.model.QuizResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface QuizResultRepository extends JpaRepository<QuizResult, Long> {
    
    // Find results by student
    List<QuizResult> findByStudentId(Long studentId);
    
    // Find results by quiz
    List<QuizResult> findByQuizId(Long quizId);
    
    // Find results by teacher
    List<QuizResult> findByTeacherId(Long teacherId);
    
    // Find results by student and quiz
    Optional<QuizResult> findByStudentIdAndQuizId(Long studentId, Long quizId);
    
    // Find results by status
    List<QuizResult> findByStatus(String status);
    
    // Find results by student and status
    List<QuizResult> findByStudentIdAndStatus(Long studentId, String status);
    
    // Find results by teacher and student email
    List<QuizResult> findByTeacherIdAndStudentEmail(Long teacherId, String studentEmail);
    
    // Count passed results
    Long countByStatusAndTeacherId(String status, Long teacherId);
}
