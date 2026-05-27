package com.trainitup.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // This applies the rules to every single endpoint in your API
                .allowedOrigins("https://train-it-up.vercel.app") // The exact URL of your frontend
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // The preflight uses OPTIONS
                .allowedHeaders("*")
                .allowCredentials(true); // Required if you are using cookies or JWT authentication
    }
}
