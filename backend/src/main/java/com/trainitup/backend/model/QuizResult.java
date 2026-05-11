package com.trainitup.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "quiz_results")
public class QuizResult {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "quiz_id")
    private Long quizId;
    
    @Column(name = "student_id")
    private Long studentId;
    
    @Column(name = "teacher_id")
    private Long teacherId;
    
    @Column(name = "exam_name")
    private String examName;
    
    @Column(name = "student_name")
    private String studentName;
    
    @Column(name = "student_email")
    private String studentEmail;
    
    @Column(name = "score")
    private Integer score;
    
    @Column(name = "percentage")
    private Integer percentage;
    
    @Column(name = "grade")
    private String grade; // A, B, C, D, F
    
    @Column(name = "status")
    private String status; // Pass, Fail
    
    @Column(columnDefinition = "LONGTEXT")
    private String feedback;
    
    @Column(name = "published_date")
    private LocalDateTime publishedDate;
    
    @Column(name = "completed_date")
    private LocalDateTime completedDate;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
    
    // Constructors
    public QuizResult() {}
    
    public QuizResult(Long quizId, Long studentId, Long teacherId, String examName, 
                     String studentName, String studentEmail, Integer score, String status) {
        this.quizId = quizId;
        this.studentId = studentId;
        this.teacherId = teacherId;
        this.examName = examName;
        this.studentName = studentName;
        this.studentEmail = studentEmail;
        this.score = score;
        this.status = status;
        this.percentage = score;
        this.grade = calculateGrade(score);
        this.publishedDate = LocalDateTime.now();
    }
    
    private static String calculateGrade(Integer score) {
        if (score >= 80) return "A";
        if (score >= 70) return "B";
        if (score >= 60) return "C";
        if (score >= 50) return "D";
        return "F";
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getQuizId() { return quizId; }
    public void setQuizId(Long quizId) { this.quizId = quizId; }
    
    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }
    
    public Long getTeacherId() { return teacherId; }
    public void setTeacherId(Long teacherId) { this.teacherId = teacherId; }
    
    public String getExamName() { return examName; }
    public void setExamName(String examName) { this.examName = examName; }
    
    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }
    
    public String getStudentEmail() { return studentEmail; }
    public void setStudentEmail(String studentEmail) { this.studentEmail = studentEmail; }
    
    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }
    
    public Integer getPercentage() { return percentage; }
    public void setPercentage(Integer percentage) { this.percentage = percentage; }
    
    public String getGrade() { return grade; }
    public void setGrade(String grade) { this.grade = grade; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }
    
    public LocalDateTime getPublishedDate() { return publishedDate; }
    public void setPublishedDate(LocalDateTime publishedDate) { this.publishedDate = publishedDate; }
    
    public LocalDateTime getCompletedDate() { return completedDate; }
    public void setCompletedDate(LocalDateTime completedDate) { this.completedDate = completedDate; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
