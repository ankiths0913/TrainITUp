# 🚀 QUICK START GUIDE - TrainITup Backend for React

## Backend Status: ✅ READY FOR REACT

---

## 🎯 What Was Done

1. **✅ Deleted SuperAdminController** - Removed duplicate controller
2. **✅ Updated CORS** - Now supports React on port 3000
3. **✅ Fixed Security Rules** - Aligned with actual endpoints
4. **✅ Enhanced CourseController** - Added error handling & validation
5. **✅ Verified No Build Errors** - All changes validated

---

## 📦 How to Run Backend

```bash
# Navigate to backend folder
cd g:\TrainITup-Workplace\backend

# Start Spring Boot server
mvn spring-boot:run

# Server runs at: http://localhost:8080
```

---

## 🔑 Important Endpoints for React

### Authentication
```
POST   /api/auth/register    - Register new user
POST   /api/auth/login       - Login (returns JWT token)
GET    /api/auth/stats       - Platform statistics
```

### Courses
```
GET    /api/courses                    - Get all courses (PUBLIC)
GET    /api/courses/teacher/{id}       - Get teacher's courses (PUBLIC)
POST   /api/courses                    - Create course (TEACHER/ADMIN)
DELETE /api/courses/{id}               - Delete course (TEACHER/ADMIN)
```

### Enrollments
```
POST   /api/enrollments/join           - Enroll in course (AUTHENTICATED)
GET    /api/enrollments/user/{userId}  - Get user's enrollments (AUTHENTICATED)
```

---

## 📝 React Frontend Setup

### Step 1: Install Dependencies
```bash
npm install axios
# or use built-in fetch API
```

### Step 2: Create API Client
```javascript
// api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
```

### Step 3: Use in React Components
```javascript
// Login example
import API from './api';

const handleLogin = async (username, password) => {
  try {
    const response = await API.post('/api/auth/login', {
      username,
      password
    });
    localStorage.setItem('authToken', response.data.token);
    localStorage.setItem('userId', response.data.userId);
    // Redirect to dashboard
  } catch (error) {
    console.error('Login failed:', error);
  }
};

// Get courses example
const fetchCourses = async () => {
  try {
    const response = await API.get('/api/courses');
    setCourses(response.data);
  } catch (error) {
    console.error('Failed to fetch courses:', error);
  }
};
```

---

## 🛡️ Security Features

- **JWT Authentication** - Stateless token-based auth
- **Role-based Access** - STUDENT, TEACHER, ADMIN roles
- **CORS Enabled** - React frontend can communicate
- **Password Encryption** - BCrypt hashing
- **Protected Endpoints** - Admin/Teacher routes secured

---

## 🗄️ Database

- **Type:** MySQL
- **Host:** localhost:3306
- **Database:** trainitup_db
- **Username:** root
- **Password:** root

---

## 📚 API Documentation

**Live Swagger UI:**
```
http://localhost:8080/swagger-ui.html
```

Visit this URL to see all endpoints, their parameters, and test them directly!

---

## ⚡ Common Issues & Solutions

### Issue: CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:** Backend is already configured for React port 3000. Make sure backend is running.

### Issue: 401 Unauthorized
```
Unauthorized access to protected endpoint
```
**Solution:** Include JWT token in Authorization header:
```javascript
headers: {
  'Authorization': `Bearer ${token}`
}
```

### Issue: 400 Bad Request
```
Invalid course title or missing required fields
```
**Solution:** Validate all required fields before sending to backend. Check API documentation.

### Issue: Database Connection Error
```
Cannot connect to MySQL
```
**Solution:** Ensure MySQL is running and credentials are correct in application.properties

---

## 🧪 Test Backend Before React Integration

```bash
# Get all courses (PUBLIC)
curl http://localhost:8080/api/courses

# Register user
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Test123!",
    "role": "STUDENT"
  }'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "Test123!"
  }'
```

---

## 📞 Support Files Created

1. **BACKEND_ANALYSIS.md** - Detailed analysis of backend
2. **REACT_INTEGRATION.md** - Complete integration guide
3. **QUICK_START.md** - This file!

---

## ✨ You're Ready!

Backend is optimized and ready for your React frontend. Start building! 🎉

