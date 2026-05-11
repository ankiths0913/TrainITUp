package com.trainitup.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;

public class CreateCourseRequest {
    
    @NotBlank(message = "Course title is required")
    private String title;
    
    @NotBlank(message = "Course subtitle is required")
    private String subtitle;
    
    @NotBlank(message = "Course description is required")
    private String description;
    
    @NotBlank(message = "Category is required")
    private String category;
    
    private String subCategory;
    
    @NotBlank(message = "Level is required")
    private String level;
    
    @NotNull(message = "Price is required")
    @Min(value = 0, message = "Price must be at least 0")
    private Double price;
    
    @NotBlank(message = "Instructor name is required")
    private String educator;
    
    @NotNull(message = "Number of lessons is required")
    @Min(value = 1, message = "Lessons must be at least 1")
    private Integer lessons;
    
    private String imageUrl;
    private String videoUrl;
    private String learningPoints;
    
    @NotNull(message = "Teacher ID is required")
    private Long teacherId;

    // Getters and Setters
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

    public Integer getLessons() { return lessons; }
    public void setLessons(Integer lessons) { this.lessons = lessons; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getVideoUrl() { return videoUrl; }
    public void setVideoUrl(String videoUrl) { this.videoUrl = videoUrl; }

    public String getLearningPoints() { return learningPoints; }
    public void setLearningPoints(String learningPoints) { this.learningPoints = learningPoints; }

    public Long getTeacherId() { return teacherId; }
    public void setTeacherId(Long teacherId) { this.teacherId = teacherId; }
}
