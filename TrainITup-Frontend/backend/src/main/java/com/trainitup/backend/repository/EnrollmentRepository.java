package com.trainitup.backend.repository;

import com.trainitup.backend.model.Enrollment;
import com.trainitup.backend.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    // To check if a specific student is in a specific course
    Optional<Enrollment> findByUserIdAndCourseId(Long userId, Long courseId);
    
    // To find all courses a student has joined
    List<Enrollment> findByUserId(Long userId);
    
    /**
     * Optimized query to fetch all courses a user is enrolled in
     * Uses INNER JOIN to get Course details directly without multiple queries
     * Much more efficient than fetching enrollments then courseIds then courses
     * 
     * @param userId The ID of the user
     * @return List of Course objects that the user is enrolled in
     */
    @Query("SELECT c FROM Course c INNER JOIN Enrollment e ON c.id = e.courseId WHERE e.userId = :userId")
    List<Course> findEnrolledCoursesByUserId(@Param("userId") Long userId);
}