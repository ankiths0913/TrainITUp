import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const API_COURSE_BASE = 'http://localhost:8080/api/courses'
const API_COURSES_ALL = `${API_COURSE_BASE}/all`
const ENROLL_API = 'http://localhost:8080/api/enrollments'

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  }
}

const fallbackCourse = {
  id: 101,
  title: 'Intro to Java',
  educator: 'Chetan Patil',
  imageUrl: '/assets/images/hero-img.jpg',
  videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
}

export const CourseDetailPage = () => {
  const [searchParams] = useSearchParams()
  const [course, setCourse] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const courseId = searchParams.get('id')

  useEffect(() => {
    const loadCourseDetails = async () => {
      try {
        if (!courseId) {
          setCourse(fallbackCourse)
          return
        }

        let response = await fetch(`${API_COURSE_BASE}/${courseId}`, { headers: getAuthHeaders() })
        if (response.ok) {
          setCourse(await response.json())
          return
        }

        response = await fetch(API_COURSES_ALL, { headers: getAuthHeaders() })
        const data = await response.json()
        const foundCourse = Array.isArray(data) ? data.find(item => String(item.id) === String(courseId)) : null
        setCourse(foundCourse || fallbackCourse)
      } catch (error) {
        console.warn('Detail page fallback used', error)
        setCourse(fallbackCourse)
      } finally {
        setIsLoading(false)
      }
    }

    loadCourseDetails()
  }, [courseId])

  const activeCourse = course || fallbackCourse

  return (
    <>
      <Navbar />
      <main className="py-5 bg-light" style={{ minHeight: '70vh' }}>
        <div className="container">
          <div className="mb-4">
            <Link to="/my-courses" className="text-success text-decoration-none fw-bold">
              <i className="bi bi-arrow-left"></i> Back to Courses
            </Link>
          </div>

          <div className="row g-4">
            <div className="col-lg-8">
              <article className="card border-0 shadow-sm mb-4 overflow-hidden">
                <div className="ratio ratio-16x9 bg-dark">
                  {isLoading ? (
                    <div className="d-flex align-items-center justify-content-center text-white">Loading course...</div>
                  ) : (
                    <iframe
                      id="videoPlayer"
                      src={activeCourse.videoUrl || fallbackCourse.videoUrl}
                      title={`${activeCourse.title || 'Course'} video player`}
                      allowFullScreen
                    ></iframe>
                  )}
                </div>
                <div className="card-body">
                  <h1 id="courseTitle" className="h2 fw-bold text-dark">{isLoading ? 'Loading...' : activeCourse.title}</h1>
                  <p id="courseEducator" className="text-muted mb-0">Taught by {activeCourse.educator || activeCourse.teacherName || 'TrainITup Mentor'}</p>
                </div>
              </article>
            </div>

            <div className="col-lg-4">
              <aside className="card border-0 shadow-sm p-4">
                <h2 className="h5 fw-bold mb-3 text-dark">Course Materials</h2>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    <span><i className="bi bi-file-earmark-pdf text-danger"></i> Lecture Notes</span>
                    <button className="btn btn-sm btn-light border">Download</button>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    <span><i className="bi bi-chat-left-text text-primary"></i> Discussion Forum</span>
                    <span className="badge bg-success rounded-pill">Active</span>
                  </li>
                </ul>
              </aside>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

const emptyCourses = []

export const MyCoursesPage = () => {
  const [courses, setCourses] = useState(emptyCourses)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const loadMyCourses = async () => {
      const userId = localStorage.getItem('userId')

      try {
        if (!userId) {
          setCourses([])
          return
        }

        const response = await fetch(`${ENROLL_API}/user/${userId}`, { headers: getAuthHeaders() })
        if (response.ok) {
          const data = await response.json()
          setCourses(Array.isArray(data) ? data : [])
          return
        }
      } catch (error) {
        console.warn('Could not load joined courses from backend, using local fallback.', error)
      } finally {
        setIsLoading(false)
      }

      setCourses(JSON.parse(localStorage.getItem('localEnrollments') || '[]'))
      setIsLoading(false)
    }

    loadMyCourses()
  }, [])

  const openCourse = (courseId) => {
    navigate(`/course-detail?id=${courseId}`)
  }

  return (
    <>
      <Navbar />
      <main className="bg-light py-5" style={{ minHeight: '70vh' }}>
        <div className="container">
          <div className="mb-5">
            <h1 className="h2 fw-bold text-dark">My Learning Library</h1>
            <p className="text-muted">Pick up right where you left off.</p>
          </div>

          <div className="row g-4" id="enrolledCoursesGrid">
            {isLoading ? (
              <div className="col-12 text-center py-5">
                <div className="spinner-border text-success" role="status"></div>
                <p className="mt-2 text-muted">Loading your courses...</p>
              </div>
            ) : courses.length === 0 ? (
              <div className="col-12 text-center py-5">
                <i className="bi bi-emoji-smile fs-1 text-muted"></i>
                <h2 className="h4 mt-3 text-dark">No courses joined yet!</h2>
                <Link to="/" className="btn btn-success mt-2">Start Browsing</Link>
              </div>
            ) : (
              courses.map(course => (
                <div className="col-md-4 col-lg-3" key={course.id || course.title}>
                  <article className="card course-card shadow-sm h-100 border-0 rounded-4">
                    <img src={course.imageUrl || '/assets/images/hero-img.jpg'} alt={course.title || 'Course'} className="card-img-top p-2 rounded-4" style={{ height: 160, objectFit: 'cover' }} />
                    <div className="card-body d-flex flex-column">
                      <h2 className="h6 fw-bold mb-1 text-dark">{course.title || 'Untitled Course'}</h2>
                      <p className="text-muted small mb-3">By {course.educator || course.teacherName || 'TrainITup Mentor'}</p>
                      <div className="mt-auto">
                        <div className="progress mb-2" style={{ height: 6 }}>
                          <div className="progress-bar w-25" role="progressbar"></div>
                        </div>
                        <button className="btn btn-dark btn-sm w-100 rounded-pill" onClick={() => openCourse(course.id)}>
                          Continue <i className="bi bi-play-fill ms-1"></i>
                        </button>
                      </div>
                    </div>
                  </article>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
