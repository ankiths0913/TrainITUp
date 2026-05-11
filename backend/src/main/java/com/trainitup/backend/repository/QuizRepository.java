package com.trainitup.backend.repository;

import com.trainitup.backend.model.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, Long> {
    
    // Find quizzes by course
    List<Quiz> findByCourseId(Long courseId);
    
    // Find quizzes by teacher
    List<Quiz> findByTeacherId(Long teacherId);
    
    // Find published quizzes
    List<Quiz> findByIsPublished(Boolean isPublished);
    
    // Find quiz by course and teacher
    List<Quiz> findByCourseIdAndTeacherId(Long courseId, Long teacherId);
    
    // Get quiz by ID and teacher (for verification)
    Optional<Quiz> findByIdAndTeacherId(Long id, Long teacherId);
    
    // Count quizzes by teacher
    Long countByTeacherId(Long teacherId);
}
