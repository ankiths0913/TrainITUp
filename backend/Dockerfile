# Stage 1: Build the Spring Boot application
# Uses a JDK image from Eclipse Temurin for compilation.
FROM eclipse-temurin:17-jdk-focal AS builder

# Set the working directory inside the container for the build stage.
WORKDIR /app

# Copy the Maven wrapper and its directory.
COPY mvnw .
COPY .mvn .mvn

# Copy the build configuration file.
COPY pom.xml .

# Copy the source code.
COPY src src

# Fix line endings in case the file was saved on Windows, then make executable
RUN sed -i 's/\r$//' mvnw
RUN chmod +x mvnw

# Build the Spring Boot application into an executable JAR.
# `-DskipTests` skips running tests during the Docker build.
RUN ./mvnw -DskipTests package

# Stage 2: Create the final, lightweight runtime image
# Uses a JRE image from Eclipse Temurin, which is much smaller than a JDK image.
FROM eclipse-temurin:17-jre-focal

# Set the working directory inside the container for the runtime stage.
WORKDIR /app

# Copy the executable JAR from the builder stage to the final image.
COPY --from=builder /app/target/backend-0.0.1-SNAPSHOT.jar app.jar

# Expose the port on which your Spring Boot application will listen.
# Based on your application.properties, this is 8080.
EXPOSE 8080

# Define the command to run your application when the container starts.
ENTRYPOINT ["java", "-jar", "app.jar"]