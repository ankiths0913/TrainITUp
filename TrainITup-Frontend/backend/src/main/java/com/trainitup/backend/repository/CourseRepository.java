package com.trainitup.backend.repository;

import com.trainitup.backend.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    
    // Custom query: Spring automatically creates "SELECT * FROM courses WHERE teacher_id = ?"
    List<Course> findByTeacherId(Long teacherId);
}