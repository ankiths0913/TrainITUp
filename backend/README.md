# Backend Docker

This backend uses Maven and Spring Boot. The Dockerfile builds the app and runs the JAR.

## Build image

```cmd
cd /d G:\TrainITup-Workplace\backend
docker build -t trainitup-backend:local .
```

## Run container (dev defaults)

```cmd
docker run --rm -p 8080:8080 ^
  -e SPRING_PROFILES_ACTIVE=prod ^
  -e DB_URL=jdbc:mysql://<host>:<port>/<db_name> ^
  -e DB_USERNAME=<db_user> ^
  -e DB_PASSWORD=<db_password> ^
  -e JWT_SECRET=<jwt_secret> ^
  -e CORS_ALLOWED_ORIGINS=http://localhost:5174 ^
  trainitup-backend:local
```

## Notes

- Set `CORS_ALLOWED_ORIGINS` to your deployed frontend domains when ready (comma-separated).
- `PORT` can be set by your hosting provider; the app reads `server.port` from that env var.
