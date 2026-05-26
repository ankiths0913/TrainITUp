package com.trainitup.backend.services;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class LocalFileStorageServiceImpl implements FileStorageService {

    // Creates an "uploads" folder in your root backend directory
    private final Path fileStorageLocation = Paths.get("uploads").toAbsolutePath().normalize();

    public LocalFileStorageServiceImpl() {
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    @Override
    public String storeFile(MultipartFile file) {
        // 1. Clean the file name and add a random UUID so files with the same name don't overwrite each other
        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
        String newFileName = UUID.randomUUID().toString() + "_" + originalFileName;

        try {
            // 2. Copy the file to the target location
            Path targetLocation = this.fileStorageLocation.resolve(newFileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            // 3. Return the public URL that the React frontend can use to display the image
            return "http://localhost:8080/uploads/" + newFileName;

        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + originalFileName + ". Please try again!", ex);
        }
    }
}
