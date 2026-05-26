import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Auth from './pages/Auth'
import StudentDashboard from './pages/StudentDashboard'
import TeacherDashboard from './pages/TeacherDashboard'
import SuperAdmin from './pages/SuperAdmin'
import Quiz from './pages/Quiz'
import { CommunityPage, MentorsPage, PricingPage, TestimonialsPage } from './pages/MarketingPages'
import { CourseDetailPage, MyCoursesPage } from './pages/CoursePages'

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
        <Route path="/mentors" element={<MentorsPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/testimonials" element={<TestimonialsPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/course-detail" element={<CourseDetailPage />} />
        <Route 
          path="/my-courses" 
          element={
            <ProtectedRoute requiredRole="STUDENT">
              <MyCoursesPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/quiz" 
          element={
            <ProtectedRoute requiredRole="STUDENT">
              <Quiz />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/create-course" 
          element={
            <ProtectedRoute requiredRole="TEACHER">
              <TeacherDashboard initialSection="create" />
            </ProtectedRoute>
          } 
        />
        
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
