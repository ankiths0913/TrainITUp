import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '/css/main.css'
import '/css/super-admin.css'

const API_BASE = 'http://localhost:8080/api/auth'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
  { id: 'teachers', label: 'Teachers', icon: 'bi-person-badge' },
  { id: 'students', label: 'Students', icon: 'bi-mortarboard' },
  { id: 'users', label: 'User Records', icon: 'bi-people' },
  { id: 'courses', label: 'Course Management', icon: 'bi-book' }
]

const sectionTitles = {
  dashboard: 'System Overview',
  teachers: 'Teacher Management',
  students: 'Student Management',
  users: 'User Management',
  courses: 'Course Audit'
}

const SuperAdmin = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState('dashboard')
  const [adminName, setAdminName] = useState('Administrator')
  const [allUsers, setAllUsers] = useState([])
  const [stats, setStats] = useState({ totalUsers: 0, totalCourses: 0, totalTeachers: 0, totalStudents: 0 })
  const [courses, setCourses] = useState([])
  const [isBackendOnline, setIsBackendOnline] = useState(true)
  const [isAuthForbidden, setIsAuthForbidden] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [newRole, setNewRole] = useState('')

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token')

    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  }

  const checkBackendHealth = async () => {
    try {
      await fetch(`${API_BASE}/stats`, {
        method: 'GET',
        headers: getAuthHeaders()
      })
      return true
    } catch {
      return false
    }
  }

  const loadStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/stats`, { headers: getAuthHeaders() })

      if (res.status === 401 || res.status === 403) {
        setIsAuthForbidden(true)
        throw new Error(`Stats API returned ${res.status}`)
      }

      if (!res.ok) throw new Error(`Stats API returned ${res.status}`)

      const data = await res.json()
      setStats(prev => ({
        ...prev,
        totalUsers: data.totalUsers || prev.totalUsers || 0,
        totalCourses: data.totalCourses || prev.totalCourses || 0
      }))
    } catch (error) {
      console.warn('Stats API unavailable:', error)
      setStats(prev => ({ ...prev, totalUsers: 0, totalCourses: 0 }))
    }
  }

  const loadAllUsers = async () => {
    try {
      const res = await fetch(`${API_BASE}/users`, { headers: getAuthHeaders() })

      if (res.status === 401 || res.status === 403) {
        setIsAuthForbidden(true)
        throw new Error(`Users API returned ${res.status}`)
      }

      if (!res.ok) throw new Error(`Users API returned ${res.status}`)

      const users = await res.json()
      const teachers = users.filter(user => user.role === 'TEACHER').length
      const students = users.filter(user => user.role === 'STUDENT').length

      setAllUsers(users)
      setStats(prev => ({
        ...prev,
        totalUsers: users.length,
        totalTeachers: teachers,
        totalStudents: students
      }))
    } catch (error) {
      console.warn('Users API unavailable:', error)
      setAllUsers([])
      setStats(prev => ({ ...prev, totalUsers: 0, totalTeachers: 0, totalStudents: 0 }))
    }
  }

  const loadAdminCourses = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/courses', {
        headers: getAuthHeaders()
      })

      if (!res.ok) throw new Error(`Courses API returned ${res.status}`)

      const coursesList = await res.json()
      const usersRes = await fetch(`${API_BASE}/users`, {
        headers: getAuthHeaders()
      })
      const users = usersRes.ok ? await usersRes.json() : []

      const coursesWithTeachers = coursesList.map((course, index) => {
        const teacher = users.find(user => user.id === course.teacherId)

        return {
          ...course,
          index: index + 1,
          teacherName: teacher ? teacher.username : 'Unknown Teacher'
        }
      })

      setCourses(coursesWithTeachers)
      setStats(prev => ({ ...prev, totalCourses: coursesList.length }))
    } catch (error) {
      console.warn('Admin Courses API unavailable:', error)
      setCourses([])
    }
  }

  const initAdminData = async () => {
    const backendOnline = await checkBackendHealth()
    setIsBackendOnline(backendOnline)
    setIsAuthForbidden(false)

    if (!backendOnline) {
      setAllUsers([])
      setCourses([])
      setStats({ totalUsers: 0, totalCourses: 0, totalTeachers: 0, totalStudents: 0 })
      return
    }

    await loadStats()
    await loadAllUsers()
    await loadAdminCourses()
  }

  useEffect(() => {
    setAdminName(localStorage.getItem('username') || 'Administrator')
    initAdminData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleDeleteUser = async (userId) => {
    if (!confirm('Confirm: This user will be permanently removed from the platform.')) return

    try {
      const res = await fetch(`${API_BASE}/users/${userId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      })

      if (!res.ok) throw new Error(`Delete API returned ${res.status}`)

      await loadAllUsers()
      await loadStats()
    } catch (error) {
      console.warn('Delete user failed:', error)
      alert('Unable to delete user right now. Please try again later.')
    }
  }

  const handleDeleteCourse = async (courseId) => {
    if (!confirm('ADMIN OVERRIDE: Are you sure you want to permanently delete this course? This action cannot be undone.')) return

    try {
      const res = await fetch(`http://localhost:8080/api/courses/${courseId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      })

      if (!res.ok) {
        alert('Failed to delete course.')
        return
      }

      alert('Course removed from the platform.')
      await loadAdminCourses()
      await loadStats()
    } catch (error) {
      console.error('Delete failed', error)
      alert('Network error while deleting course.')
    }
  }

  const openRoleModal = (user) => {
    setSelectedUser(user)
    setNewRole(user.role)
    setShowRoleModal(true)
  }

  const handleRoleChange = async () => {
    if (!selectedUser) return

    if (newRole === selectedUser.role) {
      alert('Please select a different role')
      return
    }

    try {
      const res = await fetch(`${API_BASE}/users/${selectedUser.id}/toggle-role`, {
        method: 'PUT',
        headers: getAuthHeaders()
      })

      if (!res.ok) {
        alert('Failed to change role')
        return
      }

      setShowRoleModal(false)
      await loadAllUsers()
    } catch (error) {
      console.error('Role change failed:', error)
      alert('Error: ' + error.message)
    }
  }

  const handleLogout = () => {
    if (confirm('Logout from Control Center?')) {
      logout()
      navigate('/auth')
    }
  }

  const teachers = allUsers.filter(user => user.role === 'TEACHER')
  const students = allUsers.filter(user => user.role === 'STUDENT')

  const renderUserRows = (users, emptyMessage = 'No users found') => {
    if (users.length === 0) {
      return (
        <tr>
          <td colSpan="5" className="text-center py-4 small-muted">{emptyMessage}</td>
        </tr>
      )
    }

    return users.map(user => (
      <tr key={user.id}>
        <td className="fw-bold">{user.username}</td>
        <td className="small-muted">{user.email}</td>
        <td>
          <span className={`badge-role ${String(user.role || '').toLowerCase()}`}>{user.role}</span>
        </td>
        <td className="small-muted">{user.role !== 'ADMIN' ? 'Active' : 'Owner'}</td>
        <td className="text-end">
          {user.role !== 'ADMIN' ? (
            <>
              <button className="btn btn-sm btn-outline-primary px-3 rounded-pill me-2" onClick={() => openRoleModal(user)}>
                <i className="bi bi-arrow-repeat"></i> Change Role
              </button>
              <button className="btn btn-sm btn-outline-danger px-3 rounded-pill" onClick={() => handleDeleteUser(user.id)}>
                <i className="bi bi-trash"></i> Ban
              </button>
            </>
          ) : (
            <small className="small-muted">System Owner</small>
          )}
        </td>
      </tr>
    ))
  }

  const renderUserTable = (users, emptyMessage) => (
    <div className="table-responsive">
      <table className="table-dark-custom">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th className="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>{renderUserRows(users, emptyMessage)}</tbody>
      </table>
    </div>
  )

  return (
    <div className="super-admin-page">
      <aside className="sidebar d-flex flex-column">
        <h3><i className="bi bi-shield-lock-fill"></i> TrainITUp Admin</h3>
        <ul className="nav flex-column mb-auto">
          {navItems.map(item => (
            <li className="nav-item" key={item.id}>
              <button
                type="button"
                onClick={() => setActiveSection(item.id)}
                className={`nav-link w-100 border-0 bg-transparent ${activeSection === item.id ? 'active' : ''}`}
              >
                <i className={`bi ${item.icon}`}></i> <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="sidebar-divider"></div>
        <button onClick={handleLogout} className="btn btn-outline-danger btn-sm w-100 rounded-pill" style={{ color: '#FF6B6B', borderColor: '#FF6B6B' }}>
          <i className="bi bi-box-arrow-left"></i> Logout
        </button>
      </aside>

      <main className="main-content">
        <header className="header-main">
          <div>
            <h2>Control Center</h2>
            <p>{sectionTitles[activeSection]}</p>
          </div>
          <div className="profile-chip">
            <div>
              <div style={{ fontWeight: 700 }}>{adminName}</div>
              <div className="small-muted">Super Admin</div>
            </div>
            <div className="avatar-circle">
              <i className="bi bi-person-fill"></i>
            </div>
          </div>
        </header>

        {!isBackendOnline && (
          <div className="alert rounded-3" style={{ background: 'rgba(255, 107, 107, 0.14)', border: '1px solid rgba(255, 107, 107, 0.35)', color: '#FFB3B3', marginBottom: '1.5rem' }}>
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            Backend API is offline. Showing fallback data until the server is available.
          </div>
        )}

        {isAuthForbidden && (
          <div className="alert rounded-3" style={{ background: 'rgba(255, 184, 0, 0.18)', border: '1px solid rgba(255, 184, 0, 0.4)', color: '#FFD59E', marginBottom: '1.5rem' }}>
            <i className="bi bi-shield-lock-fill me-2"></i>
            Access denied by the API. Your session may be missing or expired.
          </div>
        )}

        <section className={`admin-section ${activeSection === 'dashboard' ? 'active' : ''}`}>
          <div className="row g-4 mb-5">
            {[
              { label: 'Total Users', value: stats.totalUsers, icon: 'bi-people', color: '#6B4DFF' },
              { label: 'Teachers', value: stats.totalTeachers, icon: 'bi-person-badge', color: '#00D4AA' },
              { label: 'Students', value: stats.totalStudents, icon: 'bi-mortarboard', color: '#FFB800' },
              { label: 'Active Courses', value: stats.totalCourses, icon: 'bi-play-circle', color: '#FF6B9D' }
            ].map(stat => (
              <div className="col-md-3" key={stat.label}>
                <div className="stat-card">
                  <div className="d-flex justify-content-between">
                    <div>
                      <p className="stat-label">{stat.label}</p>
                      <h3 className="stat-value">{stat.value}</h3>
                    </div>
                    <div className="icon-box" style={{ color: stat.color }}><i className={`bi ${stat.icon}`}></i></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="glass-panel">
            <div className="section-title">System Status</div>
            <p className="small-muted mb-0">
              Welcome back, Admin. Platform monitoring is active and core systems are running normally.
            </p>
          </div>
        </section>

        <section className={`admin-section ${activeSection === 'teachers' ? 'active' : ''}`}>
          <div className="glass-panel">
            <h4 className="section-title mb-4">Teachers Management</h4>
            <div className="alert alert-info rounded-3 mb-4" style={{ background: 'rgba(0, 212, 170, 0.15)', border: '1px solid rgba(0, 212, 170, 0.3)', color: '#A5FFE8' }}>
              <i className="bi bi-info-circle-fill"></i> Total Teachers: <strong>{teachers.length}</strong>
            </div>
            {renderUserTable(teachers, 'No teachers found')}
          </div>
        </section>

        <section className={`admin-section ${activeSection === 'students' ? 'active' : ''}`}>
          <div className="glass-panel">
            <h4 className="section-title mb-4">Students Management</h4>
            <div className="alert alert-info rounded-3 mb-4" style={{ background: 'rgba(107, 77, 255, 0.15)', border: '1px solid rgba(107, 77, 255, 0.3)', color: '#B9A6FF' }}>
              <i className="bi bi-info-circle-fill"></i> Total Students: <strong>{students.length}</strong>
            </div>
            {renderUserTable(students, 'No students found')}
          </div>
        </section>

        <section className={`admin-section ${activeSection === 'users' ? 'active' : ''}`}>
          <div className="glass-panel">
            <h4 className="section-title">Platform User List</h4>
            {renderUserTable(allUsers, 'No users found')}
          </div>
        </section>

        <section className={`admin-section ${activeSection === 'courses' ? 'active' : ''}`}>
          <div className="glass-panel">
            <h4 className="section-title mb-4">Course Management (Audit Mode)</h4>
            <div className="alert alert-info rounded-3 mb-4" style={{ background: 'rgba(0, 212, 170, 0.15)', border: '1px solid rgba(0, 212, 170, 0.3)', color: '#A5FFE8' }}>
              <i className="bi bi-info-circle-fill"></i> Total Platform Courses: <strong>{courses.length}</strong>
            </div>
            <div className="table-responsive">
              <table className="table-dark-custom">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Course Title</th>
                    <th>Teacher Name</th>
                    <th>Price</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-4 small-muted">
                        No courses have been published on the platform yet.
                      </td>
                    </tr>
                  ) : (
                    courses.map(course => (
                      <tr key={course.id}>
                        <td className="small-muted">#{course.index}</td>
                        <td className="fw-bold">{course.title}</td>
                        <td>
                          <span className="badge" style={{ background: 'rgba(0, 212, 170, 0.15)', border: '1px solid rgba(0, 212, 170, 0.3)', color: '#A5FFE8', padding: '6px 12px', fontWeight: 'normal', borderRadius: '6px' }}>
                            <i className="bi bi-person-fill"></i> {course.teacherName}
                          </span>
                        </td>
                        <td>₹{course.price}</td>
                        <td className="text-end">
                          <button className="btn btn-sm btn-outline-danger px-3 rounded-pill" onClick={() => handleDeleteCourse(course.id)}>
                            <i className="bi bi-trash"></i> Remove
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>

      {showRoleModal && selectedUser && (
        <div className="modal d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)' }}>
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Change User Role</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowRoleModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-4">
                  <p className="text-muted mb-1">User Name</p>
                  <h6>{selectedUser.username}</h6>
                </div>
                <div className="mb-4">
                  <p className="text-muted mb-2">Current Role: <strong>{selectedUser.role}</strong></p>
                </div>
                <div className="mb-4">
                  <p className="text-muted mb-3">Select New Role</p>
                  {['TEACHER', 'STUDENT'].map(role => (
                    <label className="role-option" key={role}>
                      <input
                        type="radio"
                        name="newRole"
                        value={role}
                        checked={newRole === role}
                        onChange={(event) => setNewRole(event.target.value)}
                      />
                      <span className="mb-0" style={{ cursor: 'pointer', flex: 1 }}>
                        <i className={`bi ${role === 'TEACHER' ? 'bi-person-badge' : 'bi-mortarboard'}`}></i> {role === 'TEACHER' ? 'Teacher' : 'Student'}
                        <small className="d-block text-muted">{role === 'TEACHER' ? 'Can create and manage courses' : 'Can enroll and take courses'}</small>
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="modal-footer" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <button type="button" className="btn btn-secondary rounded-pill" onClick={() => setShowRoleModal(false)}>Cancel</button>
                <button type="button" className="btn btn-primary rounded-pill" onClick={handleRoleChange} style={{ background: 'var(--primary-purple)', borderColor: 'var(--primary-purple)' }}>
                  Confirm Change
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SuperAdmin
