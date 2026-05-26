package com.trainitup.backend.controller;

import com.trainitup.backend.services.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "*")
public class FileUploadController {

    @Autowired
    private FileStorageService fileStorageService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadCourseFile(@RequestParam("file") MultipartFile file) {
        try {
            // Save the file using our service
            String filePublicUrl = fileStorageService.storeFile(file);
            
            // Return the URL to the frontend so it can save it to the database or display it
            Map<String, String> response = new HashMap<>();
            response.put("message", "File uploaded successfully");
            response.put("fileUrl", filePublicUrl);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }
}
