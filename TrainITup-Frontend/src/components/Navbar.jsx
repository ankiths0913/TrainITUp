import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const dashboardTarget = {
    ADMIN: '/super-admin',
    TEACHER: '/teacher-dashboard',
    STUDENT: '/student-dashboard'
  }[user?.role]

  const dashboardLabel = {
    ADMIN: 'Admin',
    TEACHER: 'Studio',
    STUDENT: 'My Learning'
  }[user?.role]

  const dashboardIcon = {
    ADMIN: 'bi-shield-fill',
    TEACHER: 'bi-person-badge',
    STUDENT: 'bi-journal-bookmark-fill'
  }[user?.role]

  return (
    <nav className="navbar navbar-expand-lg bg-dark shadow-sm sticky-top py-3">
      <div className="container btn btn-light rounded-pill px-4">
        <Link className="navbar-brand d-inline-flex gap-2 align-items-center" to="/">
          <span className="text-primary"><i className="bi bi-book-half fs-3"></i></span>
          <span className="text-white">TrainITup</span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navContent">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-2 align-items-center">
            <li className="nav-item">
              <a className="nav-link text-dark" href="/#hero">Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-dark" href="/#courses">Courses</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-dark" href="/#mentors">Mentors</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-dark" href="/#pricing">Pricing</a>
            </li>
          </ul>
          {isAuthenticated ? (
            <div className="d-flex align-items-center gap-3">
              {dashboardTarget && (
                <Link className="text-primary text-decoration-none fw-bold" to={dashboardTarget}>
                  <i className={`bi ${dashboardIcon}`}></i> {dashboardLabel}
                </Link>
              )}
              <span className="fw-bold" style={{ color: '#E4E4F7' }}>Hi, {user?.username}</span>
              <button onClick={handleLogout} className="btn btn-outline-danger btn-sm rounded-pill px-3">
                Logout
              </button>
            </div>
          ) : (
            <div className="d-flex gap-3 align-items-center">
              <Link to="/auth" className="btn btn-light rounded-pill px-4">Log in</Link>
              <Link to="/auth" className="btn btn-primary rounded-pill px-4">Get Started</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
