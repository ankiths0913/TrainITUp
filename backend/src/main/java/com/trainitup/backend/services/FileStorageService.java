package com.trainitup.backend.services;

import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {
    // Takes the file, saves it, and returns the public URL to view it
    String storeFile(MultipartFile file);
}
