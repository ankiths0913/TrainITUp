package com.trainitup.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "courses") 
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; 
    
    private String title;
    
    @Column(name = "subtitle")
    private String subtitle;
    
    @Column(columnDefinition = "LONGTEXT")
    private String description;
    
    private String category;
    
    @Column(name = "sub_category")
    private String subCategory;
    
    private String level;
    
    private Double price;
    
    private String educator;
    
    private int lessons;

    @Column(name = "teacher_id") 
    private Long teacherId; 

    @Column(name = "image_url") 
    private String imageUrl;

    @Column(name = "video_url") 
    private String videoUrl;
    
    @Column(columnDefinition = "LONGTEXT")
    private String learningPoints;
    
    @Column(name = "is_published")
    private Boolean isPublished = false;
    
    @Column(name = "created_at")
    private java.time.LocalDateTime createdAt = java.time.LocalDateTime.now();

    public Course() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getSubtitle() { return subtitle; }
    public void setSubtitle(String subtitle) { this.subtitle = subtitle; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    
    public String getSubCategory() { return subCategory; }
    public void setSubCategory(String subCategory) { this.subCategory = subCategory; }
    
    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }
    
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public String getEducator() { return educator; }
    public void setEducator(String educator) { this.educator = educator; }

    public int getLessons() { return lessons; }
    public void setLessons(int lessons) { this.lessons = lessons; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getVideoUrl() { return videoUrl; }
    public void setVideoUrl(String videoUrl) { this.videoUrl = videoUrl; }
    
    public String getLearningPoints() { return learningPoints; }
    public void setLearningPoints(String learningPoints) { this.learningPoints = learningPoints; }
    
    public Boolean getIsPublished() { return isPublished; }
    public void setIsPublished(Boolean isPublished) { this.isPublished = isPublished; }
    
    public java.time.LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(java.time.LocalDateTime createdAt) { this.createdAt = createdAt; }

    public Long getTeacherId() { return teacherId; }
    public void setTeacherId(Long teacherId) { this.teacherId = teacherId; }
}