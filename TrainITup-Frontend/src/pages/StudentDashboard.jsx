import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Quiz from './Quiz'

// Import existing CSS from the project root (served by Vite)
import '/css/main.css'
import '/css/student-dashboard.css'
import '/css/readability-fix.css'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

const StudentDashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [activeSection, setActiveSection] = useState('overview')
  const [username, setUsername] = useState(user?.username || localStorage.getItem('username') || 'Student')
  const [userRole, setUserRole] = useState(user?.role || localStorage.getItem('userRole') || 'Student')
  const userId = localStorage.getItem('userId')

  const [stats, setStats] = useState({ timeSpent: '15:30:45', progress: 75, assignmentsDone: '17/33', streak: '12 Days' })
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [allCourses, setAllCourses] = useState([])
  const [orders, setOrders] = useState([])
  const [quizResults, setQuizResults] = useState([])
  const [orderFilter, setOrderFilter] = useState('all')

  const progressCanvasRef = useRef(null)
  const activityCanvasRef = useRef(null)
  const progressChartRef = useRef(null)
  const activityChartRef = useRef(null)

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token')
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  }

  useEffect(() => {
    setUsername(user?.username || localStorage.getItem('username') || 'Student')
    setUserRole(user?.role || localStorage.getItem('userRole') || 'Student')

    loadStats()
    loadEnrolledCourses()
    loadAllCourses()
    loadOrders()
    loadQuizResults()
    initCharts()

    return () => {
      if (progressChartRef.current) progressChartRef.current.destroy()
      if (activityChartRef.current) activityChartRef.current.destroy()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const loadStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/stats`, { headers: getAuthHeaders() })
      if (!res.ok) return
      const data = await res.json()
      setStats(prev => ({
        ...prev,
        timeSpent: data.timeSpent || prev.timeSpent,
        progress: data.progress || prev.progress,
        assignmentsDone: data.assignmentsDone || prev.assignmentsDone,
        streak: data.streak || prev.streak
      }))
    } catch (e) {
      console.warn('Stats load failed', e)
    }
  }

  const loadEnrolledCourses = async () => {
    try {
      if (!userId) throw new Error('No user id')
      const res = await fetch(`${API_BASE}/api/courses/enrolled/${userId}`, { headers: getAuthHeaders() })
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data) && data.length) {
          setEnrolledCourses(data.map((c, i) => ({ id: c.id || i, title: c.title || c.name, instructor: c.teacherName || 'Instructor', progress: c.progress || Math.floor(Math.random() * 100) })))
          return
        }
      }
    } catch (e) {
      // ignore and fallback
    }

    // fallback mock courses
    setEnrolledCourses([
      { id: 'c1', title: 'Learn UI Design', instructor: 'Jenny Wilson', progress: 27 },
      { id: 'c2', title: 'Learn Motion Design', instructor: 'Robert Fox', progress: 70 },
      { id: 'c3', title: '3D Art Fundamentals', instructor: 'Bessie Cooper', progress: 18 }
    ])
  }

  const loadAllCourses = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/courses`, { headers: getAuthHeaders() })
      if (!res.ok) return
      const data = await res.json()
      setAllCourses(Array.isArray(data) ? data : [])
    } catch (e) {
      console.warn('Courses load failed', e)
    }
  }

  const loadOrders = async () => {
    try {
      if (!userId) throw new Error('Missing user session')
      const res = await fetch(`${API_BASE}/api/orders/student/${userId}`, { headers: getAuthHeaders() })
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data)) {
          setOrders(data.map(o => ({ orderId: o.orderId || o.id, courseTitle: o.courseTitle || o.courseName || 'Untitled', amount: o.amount || o.price || 0, status: String(o.status || 'completed').toLowerCase(), purchasedAt: o.purchasedAt || o.orderDate })))
          return
        }
      }
    } catch (e) {
      console.warn('Order history unavailable', e)
    }

    // fallback orders
    setOrders([
      { orderId: 'TRN-1024', courseTitle: 'Advanced UI Design Masterclass', amount: 49, status: 'completed', purchasedAt: '2026-03-14T10:30:00Z' },
      { orderId: 'TRN-1029', courseTitle: 'React for Modern Frontend', amount: 59, status: 'pending', purchasedAt: '2026-04-01T14:10:00Z' },
      { orderId: 'TRN-1032', courseTitle: 'Motion Graphics Essentials', amount: 39, status: 'completed', purchasedAt: '2026-04-09T09:05:00Z' }
    ])
  }

  const loadQuizResults = () => {
    try {
      const published = JSON.parse(localStorage.getItem('publishedResults') || '[]')
      const studentEmail = localStorage.getItem('userEmail') || localStorage.getItem('username')
      setQuizResults(published.filter(r => r.studentEmail === studentEmail || r.studentName === studentEmail))
    } catch (e) {
      setQuizResults([])
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/auth')
  }

  const initCharts = () => {
    const create = () => {
      try {
        const Chart = window.Chart
        if (!Chart) return

        if (progressCanvasRef.current && !progressChartRef.current) {
          progressChartRef.current = new Chart(progressCanvasRef.current.getContext('2d'), {
            type: 'line',
            data: {
              labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
              datasets: [
                { label: 'Current', data: [20, 35, 40, 45, 50, 55, 60, 65, 70, 72, 75, 78], borderColor: '#6B4DFF', backgroundColor: 'rgba(107,77,255,0.1)', borderWidth: 3, fill: true, tension: 0.4, pointRadius: 0 },
                { label: 'Previous', data: [15, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75], borderColor: '#99999933', backgroundColor: 'rgba(153,153,153,0.05)', borderWidth: 2, fill: true, tension: 0.4, pointRadius: 0 }
              ]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#999' } } }, scales: { y: { beginAtZero: true, max: 100, ticks: { color: '#666' }, grid: { color: 'rgba(255,255,255,0.05)' } }, x: { ticks: { color: '#666' }, grid: { color: 'rgba(255,255,255,0.05)' } } } }
          })
        }

        if (activityCanvasRef.current && !activityChartRef.current) {
          activityChartRef.current = new Chart(activityCanvasRef.current.getContext('2d'), {
            type: 'doughnut',
            data: { labels: ['UI Design', 'Motion Design', '3D Art'], datasets: [{ data: [40, 35, 25], backgroundColor: ['#6B4DFF', '#FFB800', '#00D4AA'], borderColor: 'rgba(255,255,255,0.1)', borderWidth: 2 }] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#999' } } } }
          })
        }
      } catch (e) {
        console.warn('Chart init failed', e)
      }
    }

    if (window.Chart) {
      create()
      return
    }

    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js'
    script.async = true
    script.onload = create
    document.body.appendChild(script)
  }

  const formatOrderDate = (input) => {
    try {
      return new Date(input).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })
    } catch {
      return input || '-'
    }
  }

  const downloadResult = (result) => {
    if (!result) {
      alert('Result not found')
      return
    }

    const resultText = `
QUIZ RESULT CERTIFICATE
========================

Exam/Test Name: ${result.examName}
Student Name: ${result.studentName}
Email: ${result.studentEmail}

Score: ${result.score}/100
Percentage: ${result.score}%
Grade: ${result.grade}
Status: ${result.status}

Date Taken: ${new Date(result.publishedDate).toLocaleString()}

${result.feedback ? `Teacher Feedback:\n${result.feedback}\n\n` : ''}Generated by TrainITup
    `.trim()

    const element = document.createElement('a')
    element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(resultText)}`)
    element.setAttribute('download', `${result.examName}_${result.studentName}_Result.txt`)
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const filteredOrders = orders.filter(o => orderFilter === 'all' ? true : o.status === orderFilter)
  const calendarDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
  const calendarDates = [31, ...Array.from({ length: 30 }, (_, i) => i + 1)]
  const gradeColor = (grade) => grade === 'A' ? '#A5FFE8' : grade === 'B' ? '#FFD700' : grade === 'C' ? '#FFA500' : '#FF6B6B'

  const CourseCard = ({ course, action = 'Continue' }) => (
    <div className="col-md-4">
      <div className="course-card">
        {course.imageUrl ? (
          <div className="course-card-header" style={{ backgroundImage: `url(${course.imageUrl})` }}>
            <span className="course-card-title">{course.title || course.name || 'Untitled Course'}</span>
          </div>
        ) : (
          <div className="course-card-header" style={{ background: 'linear-gradient(135deg, #6B4DFF, #9D7AFF)' }}>
            <span className="course-card-title">{course.title || course.name || 'Untitled Course'}</span>
          </div>
        )}
        <div className="course-card-body">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.8rem' }}>
            <small style={{ color: '#999' }}>{course.instructor || course.teacherName || 'Instructor'}</small>
            {typeof course.progress === 'number' && (
              <small style={{ color: 'var(--warning-yellow)', fontWeight: 600 }}>{course.progress}%</small>
            )}
          </div>
          {typeof course.progress === 'number' && (
            <div className="progress-bar-custom">
              <div className="progress-fill" style={{ width: `${course.progress}%` }} />
            </div>
          )}
          <button className="course-continue-btn">{action}</button>
        </div>
      </div>
    </div>
  )


  return (
    <div className="student-dashboard-page student-dashboard d-flex">
      {/* Sidebar */}
      <aside className="sidebar d-flex flex-column">
        <h3><i className="bi bi-mortarboard-fill"></i> TrainITup</h3>
        <ul className="nav flex-column">
          <li className="nav-item">
            <button onClick={() => setActiveSection('overview')} id="nav-overview" className={`nav-link ${activeSection === 'overview' ? 'active' : ''}`}>
              <i className="bi bi-grid-fill"></i> <span>Overview</span>
            </button>
          </li>
          <li className="nav-item">
            <button onClick={() => setActiveSection('profile')} id="nav-profile" className={`nav-link ${activeSection === 'profile' ? 'active' : ''}`}>
              <i className="bi bi-person-fill"></i> <span>My Profile</span>
            </button>
          </li>
          <li className="nav-item">
            <button onClick={() => setActiveSection('courses')} id="nav-my-courses" className={`nav-link ${activeSection === 'courses' ? 'active' : ''}`}>
              <i className="bi bi-book-fill"></i> <span>My Course</span>
            </button>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link">
              <i className="bi bi-clipboard-check"></i> <span>Assignment</span>
            </a>
          </li>
          <li className="nav-item">
            <button onClick={() => setActiveSection('quiz')} id="nav-quiz" className={`nav-link ${activeSection === 'quiz' ? 'active' : ''}`}>
              <i className="bi bi-star-fill"></i> <span>Skill Test</span>
            </button>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link">
              <i className="bi bi-calendar-event"></i> <span>Event</span>
            </a>
          </li>
          <li className="nav-item">
            <button onClick={() => setActiveSection('results')} id="nav-results" className={`nav-link ${activeSection === 'results' ? 'active' : ''}`}>
              <i className="bi bi-file-earmark-check"></i> <span>Quiz Results</span>
            </button>
          </li>
          <li className="nav-item">
            <button onClick={() => setActiveSection('orders')} id="nav-orders" className={`nav-link ${activeSection === 'orders' ? 'active' : ''}`}>
              <i className="bi bi-bag-fill"></i> <span>Order History</span>
            </button>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link">
              <i className="bi bi-gear-fill"></i> <span>Settings</span>
            </a>
          </li>
        </ul>
        <div className="sidebar-divider" />
        <button onClick={handleLogout} className="btn btn-outline-danger btn-sm w-100 rounded-pill" style={{ color: '#FF6B6B', borderColor: '#FF6B6B' }}>
          <i className="bi bi-box-arrow-left"></i> Log Out
        </button>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="header d-flex justify-content-between align-items-center">
          <div>
            <h2>Hello, {username}!</h2>
            <p style={{ margin: 0 }}>Good morning. Let's start learning</p>
          </div>
          <div className="user-profile d-flex align-items-center gap-3">
            <span style={{ color: '#999', fontSize: '0.9rem' }}>{userRole}</span>
            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=6B4DFF&color=fff`} alt="user" style={{ width: 40, height: 40, borderRadius: '50%' }} />
          </div>
        </header>

        {/* Overview */}
        <section id="section-overview" className={`admin-section ${activeSection === 'overview' ? 'active' : ''}`}>
          <div className="row g-3 mb-4">
            <div className="col-md-3">
              <div className="stat-card">
                <div className="stat-label">Time Spend</div>
                <div className="stat-value">{stats.timeSpent}</div>
                <div className="stat-change">+1.5% This Week</div>
                <div className="stat-icon"><i className="bi bi-hourglass-split" /></div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="stat-card">
                <div className="stat-label">Course Progress</div>
                <div className="stat-value">{stats.progress}%</div>
                <div className="stat-change">-0.35% This Week</div>
                <div className="stat-icon"><i className="bi bi-graph-up" /></div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="stat-card">
                <div className="stat-label">Assignment</div>
                <div className="stat-value">{stats.assignmentsDone}</div>
                <div className="stat-change">+1 This Week</div>
                <div className="stat-icon"><i className="bi bi-clipboard-check" /></div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="stat-card">
                <div className="stat-label">Streak</div>
                <div className="stat-value">{stats.streak}</div>
                <div className="stat-change">Keep it up!</div>
                <div className="stat-icon"><i className="bi bi-fire" /></div>
              </div>
            </div>
          </div>

          <div className="row g-3 mb-4">
            <div className="col-lg-8">
              <div className="chart-container">
                <div className="chart-title">Monthly Progress</div>
                <div style={{ position: 'relative', height: 300 }}>
                  <canvas ref={progressCanvasRef} id="progressChart" />
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="chart-container">
                <div className="chart-title">Today's Activity</div>
                <div style={{ position: 'relative', height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <canvas ref={activityCanvasRef} id="activityChart" />
                </div>
              </div>
            </div>
          </div>

          <div className="row g-3 mb-4">
            <div className="col-lg-4">
              <div className="calendar-container">
                <div className="calendar-header d-flex justify-content-between align-items-center">
                  <h6 style={{ margin: 0, fontWeight: 600 }}>Event Dates</h6>
                  <small style={{ color: 'var(--primary-purple)', cursor: 'pointer' }}>See all &gt;</small>
                </div>
                <div className="calendar-grid">
                  {calendarDays.map(day => (
                    <div className="calendar-day" key={day}>{day}</div>
                  ))}
                  {calendarDates.map((date, i) => (
                    <div key={`${date}-${i}`} className={`calendar-date ${date === 13 ? 'active' : ''}`}>{date}</div>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-lg-8">
              <div className="chart-container">
                <div className="chart-title">Top Performer</div>
                {[{ name: 'Rasel Mondol', assignments: 15, score: '85/100', avatar: 'R' }, { name: 'Devon Lane', assignments: 17, score: '78/100', avatar: 'D' }, { name: 'Bessie Cooper', assignments: 20, score: '75/100', avatar: 'B' }].map((p, i) => (
                  <div className="performer-badge" key={i}>
                    <div className="performer-rank">{i + 1}</div>
                    <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=${i === 0 ? '6B4DFF' : i === 1 ? 'FFB800' : 'FF6B6B'}&color=fff`} alt="user" style={{ width: 40, height: 40, borderRadius: '50%' }} />
                    <div className="performer-info">
                      <div className="performer-name">{p.name}</div>
                      <div style={{ fontSize: '0.85rem', color: '#999' }}>{p.assignments} Assignment</div>
                    </div>
                    <div className="performer-score">{p.score}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="section-title">My Course</div>
          <div className="row g-3" id="enrolledGrid">
            {enrolledCourses.map(course => <CourseCard key={course.id} course={course} />)}
          </div>
        </section>

        {/* Profile */}
        <section id="section-profile" className={`admin-section ${activeSection === 'profile' ? 'active' : ''}`}>
          <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 15, padding: '2rem' }}>
            <h4 style={{ marginBottom: '1.5rem' }}>My Profile</h4>
            <p style={{ color: '#999' }}>Profile information and settings coming soon...</p>
          </div>
        </section>

        {/* Courses List */}
        <section id="section-courses" className={`admin-section ${activeSection === 'courses' ? 'active' : ''}`}>
          <div className="row g-3" id="allCourses">
            {allCourses.length === 0 ? (
              <div style={{ color: '#999' }}>No courses available</div>
            ) : (
              allCourses.map(course => <CourseCard key={course.id} course={course} action="View" />)
            )}
          </div>
        </section>

        {/* Skill Test */}
        <section id="section-quiz" className={`admin-section ${activeSection === 'quiz' ? 'active' : ''}`}>
          <Quiz embedded />
        </section>

        {/* Orders */}
        <section id="section-orders" className={`admin-section ${activeSection === 'orders' ? 'active' : ''}`}>
          <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 15, padding: '2rem' }}>
            <h4 style={{ marginBottom: '1rem' }}>Order History</h4>
            <div className="orders-toolbar d-flex justify-content-between align-items-center mb-3">
              <div className="orders-filters">
                <button className={`order-filter-btn ${orderFilter === 'all' ? 'active' : ''}`} onClick={() => setOrderFilter('all')}>All</button>
                <button className={`order-filter-btn ${orderFilter === 'completed' ? 'active' : ''}`} onClick={() => setOrderFilter('completed')}>Completed</button>
                <button className={`order-filter-btn ${orderFilter === 'pending' ? 'active' : ''}`} onClick={() => setOrderFilter('pending')}>Pending</button>
              </div>
              <small style={{ color: '#999' }}>{filteredOrders.length} orders</small>
            </div>
            <div id="ordersList">
              {filteredOrders.length === 0 ? (
                <div className="orders-placeholder">No orders found for this filter.</div>
              ) : (
                filteredOrders.map(o => (
                  <div className="order-card" key={o.orderId}>
                    <div>
                      <div className="order-title">{o.courseTitle}</div>
                      <div className="order-meta">Order #{o.orderId} • {formatOrderDate(o.purchasedAt)}</div>
                    </div>
                    <div className="order-amount">${Number(o.amount).toFixed(2)}</div>
                    <div className={`order-status ${o.status}`}>{o.status}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Quiz Results */}
        <section id="section-results" className={`admin-section ${activeSection === 'results' ? 'active' : ''}`}>
          <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 15, padding: '2rem' }}>
            <h4 style={{ marginBottom: '2rem' }}>My Quiz Results</h4>
            <div id="quizResultsList" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))', gap: '1.5rem' }}>
              {quizResults.length === 0 ? (
                <p style={{ color: '#999', gridColumn: '1 / -1' }}>No quiz results yet</p>
              ) : (
                quizResults.map(r => (
                  <div key={r.id} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 15, padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                      <div>
                        <h5 style={{ margin: 0, color: '#f5f5f5' }}>{r.examName}</h5>
                        <p style={{ margin: 0, color: '#999', fontSize: '.9rem' }}>Taken on {new Date(r.publishedDate).toLocaleDateString()}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '1rem' }}>
                          <div>
                            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#6B4DFF', lineHeight: 1 }}>{r.score}%</div>
                            <div style={{ fontSize: '.75rem', color: '#999' }}>Score</div>
                          </div>
                          <div style={{ width: 60, height: 60, borderRadius: '50%', background: `${gradeColor(r.grade)}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${gradeColor(r.grade)}` }}>
                            <span style={{ fontSize: '1.8rem', fontWeight: 700, color: gradeColor(r.grade) }}>{r.grade}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '.5rem', marginBottom: '1rem' }}>
                      <span style={{ fontSize: '.8rem', padding: '.25rem .75rem', background: 'rgba(255,255,255,0.1)', borderRadius: 20, color: r.status === 'Pass' ? '#A5FFE8' : '#FFB3B3' }}>{r.status}</span>
                    </div>
                    {r.feedback && (
                      <div style={{ background: 'rgba(0,0,0,0.3)', borderLeft: '3px solid #6B4DFF', padding: '1rem', borderRadius: 8, marginBottom: '1rem' }}>
                        <p style={{ margin: 0, color: '#A8A8C2', fontSize: '.9rem' }}><strong>Feedback:</strong></p>
                        <p style={{ margin: '.5rem 0 0 0', color: '#A8A8C2', fontSize: '.85rem' }}>&quot;{r.feedback}&quot;</p>
                      </div>
                    )}
                    <button onClick={() => downloadResult(r)} style={{ background: 'rgba(107,77,255,0.2)', border: '1px solid rgba(107,77,255,0.5)', color: '#6B4DFF', padding: '.5rem 1rem', borderRadius: 8 }}> <i className="bi bi-download" /> Download Result</button>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

      </main>
    </div>
  )
}

export default StudentDashboard
