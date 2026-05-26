import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Auth from './pages/Auth'
import StudentDashboard from './pages/StudentDashboard'
import TeacherDashboard from './pages/TeacherDashboard'
import SuperAdmin from './pages/SuperAdmin'
import Quiz from './pages/Quiz'
import PlaceholderPage from './pages/PlaceholderPage'

function App() {
  const futureFlags = {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  }

  return (
    <Router future={futureFlags}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/mentors" element={<PlaceholderPage title="Mentors" sourceFile="html/mentors.html" />} />
        <Route path="/community" element={<PlaceholderPage title="Community" sourceFile="html/community.html" />} />
        <Route path="/testimonials" element={<PlaceholderPage title="Testimonials" sourceFile="html/testimonials.html" />} />
        <Route path="/pricing" element={<PlaceholderPage title="Pricing" sourceFile="html/pricing.html" />} />
        <Route path="/course-detail" element={<PlaceholderPage title="Course Detail" sourceFile="html/course-detail.html" />} />
        <Route path="/my-courses" element={<PlaceholderPage title="My Courses" sourceFile="html/my-courses.html" />} />
        <Route 
          path="/quiz" 
          element={
            <ProtectedRoute requiredRole="STUDENT">
              <Quiz />
            </ProtectedRoute>
          } 
        />
        <Route path="/create-course" element={<PlaceholderPage title="Create Course" sourceFile="html/create-course.html" />} />
        
        {/* Protected Routes */}
        <Route 
          path="/student-dashboard" 
          element={
            <ProtectedRoute requiredRole="STUDENT">
              <StudentDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/teacher-dashboard" 
          element={
            <ProtectedRoute requiredRole="TEACHER">
              <TeacherDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/super-admin" 
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <SuperAdmin />
            </ProtectedRoute>
          } 
        />
        
        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}

export default App
