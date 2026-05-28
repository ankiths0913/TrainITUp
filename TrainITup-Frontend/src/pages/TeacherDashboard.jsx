import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import '/css/main.css'
import '/css/teacher-dashboard.css'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
const COURSES_API = `${API_BASE}/api/courses`

const navItems = [
  { id: 'overview', label: 'Overview', icon: 'bi-speedometer2' },
  { id: 'courses', label: 'My Content', icon: 'bi-journal-bookmark-fill' },
  { id: 'create', label: 'Create Course', icon: 'bi-plus-circle' },
  { id: 'students', label: 'Enrolled Students', icon: 'bi-people-fill' },
  { id: 'results', label: 'Publish Results', icon: 'bi-file-earmark-text' }
]

const emptyCourse = {
  title: '',
  category: '',
  level: '',
  price: '',
  instructor: '',
  description: '',
  learningItems: ['']
}

const TeacherDashboard = ({ initialSection = 'overview' }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const coverInputRef = useRef(null)
  const videoInputRef = useRef(null)
  const teacherId = localStorage.getItem('userId')
  const teacherName = user?.username || localStorage.getItem('username') || 'Instructor'
  const userRole = user?.role || localStorage.getItem('userRole') || 'Teacher'

  const [activeSection, setActiveSection] = useState(initialSection)
  const [activeTab, setActiveTab] = useState('course-details')
  const [openFaqs, setOpenFaqs] = useState(['experience'])
  const [courses, setCourses] = useState([])
  const [courseError, setCourseError] = useState('')
  const [courseForm, setCourseForm] = useState({ ...emptyCourse, instructor: teacherName })
  const [coverUpload, setCoverUpload] = useState(null)
  const [videoUpload, setVideoUpload] = useState(null)
  const [uploadedCoverUrl, setUploadedCoverUrl] = useState('')
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState('')
  const [resultForm, setResultForm] = useState({
    examName: '',
    studentName: '',
    studentEmail: '',
    score: '',
    status: 'Pass',
    feedback: ''
  })
  const [publishedResults, setPublishedResults] = useState([])

  const authHeaders = () => {
    const token = localStorage.getItem('token')
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  const loadPublishedResults = () => {
    try {
      setPublishedResults(JSON.parse(localStorage.getItem('publishedResults') || '[]'))
    } catch {
      setPublishedResults([])
    }
  }

  const loadMyCourses = async () => {
    setCourseError('')

    try {
      if (!teacherId) throw new Error('Missing teacher session')

      const response = await axios.get(`${COURSES_API}/teacher/${teacherId}`, {
        headers: authHeaders()
      })
      const safeCourses = Array.isArray(response.data) ? response.data : []
      setCourses(safeCourses)
    } catch (error) {
      console.error('Failed to load courses:', error)
      setCourses([])
      setCourseError('Unable to load your courses right now. Please try again shortly.')
    }
  }

  useEffect(() => {
    setCourseForm(prev => ({ ...prev, instructor: teacherName }))
    loadMyCourses()
    loadPublishedResults()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (activeSection === 'results') loadPublishedResults()
  }, [activeSection])

  const mockCourses = useMemo(() => ([
    { id: 'mock-1', title: 'Learn UI Design', instructor: 'You', progress: 100 },
    { id: 'mock-2', title: 'Learn Web Development', instructor: 'You', progress: 85 },
    { id: 'mock-3', title: 'Learn UX Design', instructor: 'You', progress: 70 }
  ]), [])

  const handleLogout = () => {
    logout()
    navigate('/auth')
  }

  const updateCourseField = (event) => {
    setCourseForm({ ...courseForm, [event.target.name]: event.target.value })
  }

  const updateLearningItem = (index, value) => {
    setCourseForm(prev => ({
      ...prev,
      learningItems: prev.learningItems.map((item, itemIndex) => itemIndex === index ? value : item)
    }))
  }

  const addLearningItem = () => {
    setCourseForm(prev => ({ ...prev, learningItems: [...prev.learningItems, ''] }))
  }

  const uploadFileToBackend = async (file, type) => {
    const setUpload = type === 'image' ? setCoverUpload : setVideoUpload
    const formData = new FormData()
    formData.append('file', file)

    setUpload({ name: file.name, size: (file.size / (1024 * 1024)).toFixed(2), progress: 0, status: 'uploading' })

    try {
      const response = await axios.post(`${COURSES_API}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...authHeaders()
        },
        onUploadProgress: (progressEvent) => {
          const total = progressEvent.total || file.size
          const progress = Math.round((progressEvent.loaded * 100) / total)
          setUpload(prev => prev ? { ...prev, progress } : prev)
        }
      })

      const fileUrl = response?.data?.fileUrl || ''
      if (type === 'image') setUploadedCoverUrl(fileUrl)
      if (type === 'video') setUploadedVideoUrl(fileUrl)
      setUpload(prev => prev ? { ...prev, progress: 100, status: 'done' } : prev)
    } catch (error) {
      console.error('Upload failed:', error)
      setUpload(prev => prev ? { ...prev, status: 'failed' } : prev)
    }
  }

  const handleFileChange = (event, type) => {
    const file = event.target.files?.[0]
    if (!file) return
    uploadFileToBackend(file, type)
  }

  const submitCourse = async () => {
    const courseData = {
      title: courseForm.title.trim(),
      description: courseForm.description.trim(),
      price: courseForm.price,
      category: courseForm.category,
      level: courseForm.level,
      imageUrl: uploadedCoverUrl,
      videoUrl: uploadedVideoUrl,
      teacherId
    }

    const missingFields = []
    if (!courseData.title) missingFields.push('Title')
    if (!courseData.description) missingFields.push('Description')
    if (courseData.price === '' || courseData.price === null) missingFields.push('Price')
    if (!courseData.category) missingFields.push('Category')
    if (!courseData.level) missingFields.push('Level')

    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(', ')}.`)
      return
    }

    try {
      await axios.post(COURSES_API, courseData, {
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders()
        }
      })

      alert('Course Created Successfully!')
      setCourseForm({ ...emptyCourse, instructor: teacherName })
      setUploadedCoverUrl('')
      setUploadedVideoUrl('')
      setCoverUpload(null)
      setVideoUpload(null)
      setActiveSection('courses')
      await loadMyCourses()
    } catch (error) {
      console.error('Course submit failed:', error)
      alert('Failed to create course. Please try again.')
    }
  }

  const deleteCourse = async (courseId) => {
    if (!confirm('Are you sure you want to delete this course?')) return

    try {
      await axios.delete(`${COURSES_API}/${courseId}`, { headers: authHeaders() })
      await loadMyCourses()
    } catch (error) {
      console.error('Delete course failed:', error)
      alert('Unable to delete this course right now.')
    }
  }

  const publishResult = () => {
    const score = Number(resultForm.score)

    if (!resultForm.examName.trim() || !resultForm.studentName.trim() || !resultForm.studentEmail.trim() || Number.isNaN(score)) {
      alert('Please fill in all required fields')
      return
    }

    if (score < 0 || score > 100) {
      alert('Score must be between 0 and 100')
      return
    }

    const result = {
      id: Math.random().toString(36).slice(2, 11),
      examName: resultForm.examName.trim(),
      studentName: resultForm.studentName.trim(),
      studentEmail: resultForm.studentEmail.trim(),
      score,
      status: resultForm.status,
      feedback: resultForm.feedback.trim(),
      publishedDate: new Date().toISOString(),
      teacherId,
      percentage: score,
      grade: score >= 80 ? 'A' : score >= 70 ? 'B' : score >= 60 ? 'C' : 'F'
    }

    const nextResults = [...publishedResults, result]
    localStorage.setItem('publishedResults', JSON.stringify(nextResults))
    setPublishedResults(nextResults)
    setResultForm({ examName: '', studentName: '', studentEmail: '', score: '', status: 'Pass', feedback: '' })
    alert('Result published successfully!')
  }

  const deleteResult = (resultId) => {
    if (!confirm('Are you sure you want to delete this result?')) return

    const nextResults = publishedResults.filter(result => result.id !== resultId)
    localStorage.setItem('publishedResults', JSON.stringify(nextResults))
    setPublishedResults(nextResults)
  }

  const resolveCourseImageUrl = (imageUrl) => {
    if (!imageUrl) return ''
    if (/^https?:\/\//i.test(imageUrl)) return imageUrl
    if (imageUrl.startsWith('/')) return `${API_BASE}${imageUrl}`
    return `${API_BASE}/${imageUrl}`
  }

  const CourseCard = ({ course, mock = false }) => (
    <div className="col-md-4">
      <div className="course-card">
        {mock ? (
          <>
            <div className="course-card-header" style={{ background: 'linear-gradient(135deg, #6B4DFF, #9D7AFF)' }}>
              <span className="course-card-title">{course.title}</span>
            </div>
            <div className="course-card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <small style={{ color: '#999' }}>{course.instructor}</small>
                <small style={{ color: 'var(--warning-yellow)', fontWeight: 600 }}>{course.progress}%</small>
              </div>
              <div className="progress-bar-custom">
                <div className="progress-fill" style={{ width: `${course.progress}%` }}></div>
              </div>
              <button className="course-continue-btn" style={{ background: 'linear-gradient(135deg, var(--primary-purple), #9D7AFF)', color: 'white', border: 'none', borderRadius: 10, padding: '0.6rem 1.5rem', fontWeight: 600, cursor: 'pointer', marginTop: '1rem', width: '100%' }}>Edit Course</button>
            </div>
          </>
        ) : (
          <>
            {resolveCourseImageUrl(course.imageUrl) && (
              <img
                src={resolveCourseImageUrl(course.imageUrl)}
                className="card-img-top"
                style={{ height: 180, objectFit: 'cover' }}
                alt={course.title}
              />
            )}
            <div className="card-body p-4 course-card-body">
              <h6 className="fw-bold mb-2" style={{ color: 'var(--light-text)' }}>{course.title}</h6>
              <p style={{ color: '#999', fontSize: '0.85rem', margin: '0.5rem 0' }}>
                {course.lessons || 0} Lessons | <span style={{ color: 'var(--primary-purple)', fontWeight: 'bold' }}>₹{course.price}</span>
              </p>
              <div className="d-flex gap-2" style={{ marginTop: '1rem' }}>
                <button className="btn btn-light border btn-sm w-100 rounded-pill">Manage</button>
                <button className="btn btn-outline-danger btn-sm rounded-circle" onClick={() => deleteCourse(course.id)}>
                  <i className="bi bi-trash"></i>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )

  const FileStatus = ({ upload, icon }) => {
    if (!upload) return null

    return (
      <div className="file-item">
        <div>
          <i className={`bi ${icon}`} style={{ color: upload.status === 'failed' ? '#FF6B6B' : '#00D4AA' }}></i>
          <span style={{ marginLeft: '0.8rem' }}>{upload.name}</span>
          <span style={{ color: '#999', fontSize: '0.8rem', marginLeft: '1rem' }}>{upload.size} MB</span>
        </div>
        <div className="d-flex align-items-center gap-3">
          <div className="progress-bar-custom">
            <div className="progress-fill" style={{ width: `${upload.progress}%`, background: upload.status === 'failed' ? '#FF6B6B' : undefined }}></div>
          </div>
          <span style={{ fontSize: '0.85rem' }}>{upload.status === 'failed' ? 'Failed' : `${upload.progress}%`}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="teacher-dashboard-page">
      <aside className="sidebar d-flex flex-column shadow">
        <h3><i className="bi bi-mortarboard-fill"></i> TrainITup</h3>
        <ul className="nav flex-column">
          {navItems.map(item => (
            <li className="nav-item" key={item.id}>
              <button type="button" onClick={() => setActiveSection(item.id)} className={`nav-link w-100 border-0 bg-transparent ${activeSection === item.id ? 'active' : ''}`}>
                <i className={`bi ${item.icon}`}></i> <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', margin: '1.5rem 0' }}></div>
        <button onClick={handleLogout} className="btn btn-outline-danger btn-sm w-100 rounded-pill" style={{ color: 'var(--danger-red)', borderColor: 'var(--danger-red)' }}>
          <i className="bi bi-box-arrow-left"></i> Log Out
        </button>
      </aside>

      <main className="main-content">
        <header className="header-main">
          <div>
            <h2>Hello, <span>{teacherName}</span>!</h2>
            <p>Good morning. Let's start teaching</p>
          </div>
          <div className="user-profile">
            <span style={{ color: '#999', fontSize: '0.9rem' }}>{userRole}</span>
            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(teacherName)}&background=6B4DFF&color=fff`} alt="teacher" />
          </div>
        </header>

        <section className={`admin-section ${activeSection === 'overview' ? 'active' : ''}`}>
          <div className="row g-3 mb-4">
            <div className="col-md-4">
              <div className="stat-card">
                <div className="stat-label">Published Courses</div>
                <div className="stat-value">{courses.length}</div>
                <div style={{ fontSize: '0.85rem', color: '#999', marginTop: '0.5rem' }}><i className="bi bi-book"></i> Active</div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="stat-card">
                <div className="stat-label">Total Students</div>
                <div className="stat-value">0</div>
                <div style={{ fontSize: '0.85rem', color: '#999', marginTop: '0.5rem' }}><i className="bi bi-people"></i> Enrolled</div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="stat-card">
                <div className="stat-label">Creation</div>
                <button onClick={() => setActiveSection('create')} className="btn btn-primary-custom w-100" style={{ marginTop: '0.8rem', padding: '0.6rem' }}>
                  <i className="bi bi-plus-lg"></i> New Course
                </button>
              </div>
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 15, padding: '2rem', backdropFilter: 'blur(10px)', marginBottom: '2rem' }}>
            <h4 style={{ marginBottom: '1rem' }}><i className="bi bi-rocket-takeoff-fill"></i> Grow Your Reach</h4>
            <p style={{ color: '#999', marginBottom: 0 }}>Teachers who post at least one lesson per week see 3x more student engagement!</p>
          </div>

          <div className="section-title">My Courses</div>
          <div className="row g-3">
            {mockCourses.map(course => <CourseCard key={course.id} course={course} mock />)}
          </div>
        </section>

        <section className={`admin-section ${activeSection === 'courses' ? 'active' : ''}`}>
          <h3 style={{ marginBottom: '2rem' }}>My Published Courses</h3>
          <div className="row g-3">
            {courseError && (
              <div className="col-12">
                <div className="glass-panel text-center" style={{ padding: '1.5rem' }}>
                  <p className="mb-0 small-muted">{courseError}</p>
                </div>
              </div>
            )}
            {!courseError && courses.length === 0 && (
              <div className="col-12">
                <div className="glass-panel text-center" style={{ padding: '1.5rem' }}>
                  <p className="mb-0 small-muted">No courses found for your instructor account yet.</p>
                </div>
              </div>
            )}
            {courses.map(course => <CourseCard key={course.id} course={course} />)}
          </div>
        </section>

        <section className={`admin-section ${activeSection === 'create' ? 'active' : ''}`}>
          <div className="create-course-header">
            <div>
              <h3>Create New Course</h3>
              <p>Build engaging educational content</p>
            </div>
          </div>

          <div className="tabs-container">
            <div className="tabs">
              {[
                ['course-details', 'Course Details'],
                ['curriculum', 'Curriculum'],
                ['faq', 'FAQ']
              ].map(([tab, label], index) => (
                <button key={tab} className={`tab-button ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
                  <span className="tab-number">{index + 1}</span>
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className={`tab-content ${activeTab === 'course-details' ? 'active' : ''}`}>
            <div className="form-group-custom">
              <label className="form-label">Course Title</label>
              <input name="title" value={courseForm.title} onChange={updateCourseField} type="text" className="form-control-custom" placeholder="Graphic Design Bootcamp: Photoshop, Illustrator, InDesign" required />
            </div>

            <div className="form-row">
              <div className="form-group-custom">
                <label className="form-label">Category</label>
                <select name="category" value={courseForm.category} onChange={updateCourseField} className="form-control-custom" required>
                  <option value="">Select Category</option>
                  <option value="design">Design</option>
                  <option value="development">Development</option>
                  <option value="business">Business</option>
                  <option value="marketing">Marketing</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group-custom">
                <label className="form-label">Level</label>
                <select name="level" value={courseForm.level} onChange={updateCourseField} className="form-control-custom" required>
                  <option value="">Select Level</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div className="form-group-custom">
                <label className="form-label">Price</label>
                <input name="price" value={courseForm.price} onChange={updateCourseField} type="number" className="form-control-custom" placeholder="250.00" step="0.01" required />
              </div>
            </div>

            <div className="form-group-custom">
              <label className="form-label">Instructor</label>
              <input name="instructor" value={courseForm.instructor} onChange={updateCourseField} type="text" className="form-control-custom" placeholder="Your Name" required />
            </div>

            <div className="form-group-custom">
              <label className="form-label">Course Description</label>
              <textarea name="description" value={courseForm.description} onChange={updateCourseField} className="form-control-custom" placeholder="Learn with TrainITup is an interesting platform..." required style={{ minHeight: 120 }}></textarea>
            </div>

            <div className="form-group-custom">
              <label className="form-label">What Students Will Learn?</label>
              {courseForm.learningItems.map((item, index) => (
                <input key={index} type="text" value={item} onChange={(event) => updateLearningItem(index, event.target.value)} className="form-control-custom" placeholder="Learn Figma Basics to Advanced Design" style={index ? { marginTop: '0.8rem' } : undefined} />
              ))}
              <button type="button" className="btn-add" style={{ marginTop: '0.8rem' }} onClick={addLearningItem}>
                <i className="bi bi-plus"></i> Add More
              </button>
            </div>

            <div className="form-row full">
              <div className="form-group-custom">
                <label className="form-label">Cover Photo</label>
                <button type="button" className="upload-area w-100" onClick={() => coverInputRef.current?.click()}>
                  <i className="bi bi-image"></i>
                  <p>Drag & Drop image or Browse</p>
                  <small>Max. file size: 20MB</small>
                </button>
                <input ref={coverInputRef} type="file" hidden accept="image/*" onChange={(event) => handleFileChange(event, 'image')} />
              </div>
              <div className="form-group-custom">
                <label className="form-label">Promotional Video</label>
                <button type="button" className="upload-area w-100" onClick={() => videoInputRef.current?.click()}>
                  <i className="bi bi-play-circle"></i>
                  <p>Drag & Drop video or Browse</p>
                  <small>Max. file size: 500MB</small>
                </button>
                <input ref={videoInputRef} type="file" hidden accept="video/*" onChange={(event) => handleFileChange(event, 'video')} />
              </div>
            </div>

            <FileStatus upload={coverUpload} icon="bi-file-earmark-image" />
            <FileStatus upload={videoUpload} icon="bi-file-earmark-play" />

            <div className="button-group">
              <button type="button" className="btn-primary-custom" onClick={() => setActiveTab('curriculum')}>
                Save & Continue <i className="bi bi-arrow-right"></i>
              </button>
              <button type="button" className="btn-secondary-custom">
                <i className="bi bi-download"></i> Save as Draft
              </button>
            </div>
          </div>

          <div className={`tab-content ${activeTab === 'curriculum' ? 'active' : ''}`}>
            {[
              ['Module 1: Introduction', 'Lesson 1-3', true],
              ['Module 2: Advanced Topics', 'Lesson 4-6', false]
            ].map(([title, range, showLesson]) => (
              <div className="module" key={title}>
                <div className="module-header">
                  <div>
                    <div className="module-title">{title}</div>
                    <small style={{ color: '#999', marginTop: '0.3rem', display: 'block' }}>{range}</small>
                  </div>
                  <button type="button" className="btn-add" onClick={() => alert('Module added!')}>
                    <i className="bi bi-plus"></i> Add Module
                  </button>
                </div>
                {showLesson && (
                  <div style={{ background: 'white', color: '#1a1f3a', padding: '1rem', borderRadius: 6, margin: '0.8rem 0', borderLeft: '4px solid #08bd80' }}>
                    <strong>Lesson 1: Getting Started</strong>
                  </div>
                )}
                <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                  <button type="button" className="btn-add" onClick={() => alert('Lesson added!')}><i className="bi bi-plus"></i> Add Lesson</button>
                  <button type="button" className="btn-add" onClick={() => alert('Quiz added!')}><i className="bi bi-plus"></i> Add Quiz</button>
                </div>
              </div>
            ))}
            <div className="button-group" style={{ marginTop: '2rem' }}>
              <button type="button" className="btn-primary-custom" onClick={() => setActiveTab('faq')}>
                Save & Continue <i className="bi bi-arrow-right"></i>
              </button>
              <button type="button" className="btn-secondary-custom"><i className="bi bi-download"></i> Save as Draft</button>
            </div>
          </div>

          <div className={`tab-content ${activeTab === 'faq' ? 'active' : ''}`}>
            {[
              ['experience', 'Do I need any prior experience?', 'No prior experience is required! This course is designed for beginners and covers all fundamental concepts from the ground up.'],
              ['topics', 'What topics will be covered?', 'The course covers design basics, principles, tools, and practical implementation techniques.'],
              ['duration', 'How long does the course take?', 'Most students complete the course in 4-6 weeks depending on their commitment level.']
            ].map(([id, question, answer]) => (
              <div className={`faq-item ${openFaqs.includes(id) ? 'active' : ''}`} key={id}>
                <button type="button" className="faq-question w-100 border-0 text-start" onClick={() => setOpenFaqs(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id])}>
                  <span>{question}</span>
                  <i className="bi bi-chevron-down"></i>
                </button>
                <div className="faq-answer">
                  <p>{answer}</p>
                </div>
              </div>
            ))}
            <button type="button" className="btn-add" style={{ marginTop: '1.5rem' }} onClick={() => alert('FAQ added!')}>
              <i className="bi bi-plus"></i> Add FAQ
            </button>
            <div className="button-group" style={{ marginTop: '2rem' }}>
              <button type="button" className="btn-primary-custom" onClick={submitCourse}>
                <i className="bi bi-check-circle"></i> Publish Course
              </button>
              <button type="button" className="btn-secondary-custom"><i className="bi bi-download"></i> Save as Draft</button>
            </div>
          </div>
        </section>

        <section className={`admin-section ${activeSection === 'students' ? 'active' : ''}`}>
          <h3 style={{ marginBottom: '2rem' }}>Student Enrollment</h3>
          <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 15, padding: '2rem', backdropFilter: 'blur(10px)' }}>
            <h6 style={{ marginBottom: '1rem' }}>Enrolled Students</h6>
            <p style={{ color: '#999', margin: 0 }}>No students enrolled yet. When students enroll in your courses, they'll appear here.</p>
          </div>
        </section>

        <section className={`admin-section ${activeSection === 'results' ? 'active' : ''}`}>
          <h3 style={{ marginBottom: '2rem' }}>Publish Exam/Test Results</h3>
          <div className="row g-3">
            <div className="col-lg-6">
              <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 15, padding: '2rem', backdropFilter: 'blur(10px)' }}>
                <h5 className="mb-3">Publish New Result</h5>
                {[
                  ['examName', 'Exam/Test Name', 'text', 'e.g., Final Exam, Quiz 1, Midterm Test'],
                  ['studentName', 'Student Name', 'text', 'Student name'],
                  ['studentEmail', 'Student Email', 'email', 'student@email.com']
                ].map(([name, label, type, placeholder]) => (
                  <div className="mb-3" key={name}>
                    <label className="form-label">{label}</label>
                    <input type={type} value={resultForm[name]} onChange={(event) => setResultForm({ ...resultForm, [name]: event.target.value })} className="form-control-custom" placeholder={placeholder} />
                  </div>
                ))}
                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <label className="form-label">Score (Out of 100)</label>
                    <input type="number" value={resultForm.score} onChange={(event) => setResultForm({ ...resultForm, score: event.target.value })} className="form-control-custom" placeholder="85" min="0" max="100" />
                  </div>
                  <div className="col-6">
                    <label className="form-label">Pass/Fail</label>
                    <select value={resultForm.status} onChange={(event) => setResultForm({ ...resultForm, status: event.target.value })} className="form-control-custom">
                      <option value="Pass">Pass</option>
                      <option value="Fail">Fail</option>
                    </select>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Feedback (Optional)</label>
                  <textarea value={resultForm.feedback} onChange={(event) => setResultForm({ ...resultForm, feedback: event.target.value })} className="form-control-custom" placeholder="Add feedback for the student..." rows="3"></textarea>
                </div>
                <button onClick={publishResult} className="btn btn-primary w-100 rounded-pill">
                  <i className="bi bi-cloud-upload"></i> Publish Result
                </button>
              </div>
            </div>

            <div className="col-lg-6">
              <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 15, padding: '2rem', backdropFilter: 'blur(10px)' }}>
                <h5 className="mb-3">Published Results</h5>
                <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                  {publishedResults.length === 0 ? (
                    <p style={{ color: '#999' }}>No results published yet</p>
                  ) : (
                    publishedResults.map(result => (
                      <div key={result.id} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '1rem', marginBottom: '1rem' }}>
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div>
                            <div style={{ fontWeight: 600, color: '#f5f5f5' }}>{result.examName}</div>
                            <div style={{ fontSize: '0.85rem', color: '#999' }}>{result.studentName}</div>
                          </div>
                          <div className="text-end">
                            <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#6B4DFF' }}>{result.score}%</div>
                            <div style={{ fontSize: '0.8rem', color: result.status === 'Pass' ? '#A5FFE8' : '#FFB3B3' }}>{result.status}</div>
                          </div>
                        </div>
                        {result.feedback && (
                          <div style={{ fontSize: '0.85rem', color: '#A8A8C2', padding: '0.8rem', background: 'rgba(0,0,0,0.3)', borderRadius: 8, marginTop: '0.8rem' }}>
                            &quot;{result.feedback}&quot;
                          </div>
                        )}
                        <button onClick={() => deleteResult(result.id)} style={{ background: 'none', border: 'none', color: '#FF6B6B', cursor: 'pointer', fontSize: '0.8rem', marginTop: '0.8rem' }}>
                          <i className="bi bi-trash"></i> Delete
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default TeacherDashboard
