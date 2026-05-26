import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/auth.css'

const routeForRole = (role) => {
  const normalizedRole = String(role || '').toUpperCase()

  if (normalizedRole === 'ADMIN') return '/super-admin'
  if (normalizedRole === 'TEACHER') return '/teacher-dashboard'
  if (normalizedRole === 'STUDENT') return '/student-dashboard'

  return '/'
}

const Auth = () => {
  const navigate = useNavigate()
  const { login, register, isAuthenticated, user } = useAuth()
  const [isActive, setIsActive] = useState(false)
  const [loadingLogin, setLoadingLogin] = useState(false)
  const [loadingRegister, setLoadingRegister] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [registerError, setRegisterError] = useState('')
  const [loginForm, setLoginForm] = useState({ username: '', password: '' })
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  useEffect(() => {
    if (isAuthenticated && user?.role) {
      navigate(routeForRole(user.role), { replace: true })
      return
    }

    const userId = localStorage.getItem('userId')
    const userRole = localStorage.getItem('userRole')

    if (userId && userRole) {
      navigate(routeForRole(userRole), { replace: true })
    }
  }, [isAuthenticated, navigate, user])

  const handleLoginSubmit = async (event) => {
    event.preventDefault()
    setLoadingLogin(true)
    setLoginError('')

    const result = await login(loginForm.username, loginForm.password)

    if (result.success) {
      navigate(routeForRole(result.data?.role), { replace: true })
    } else {
      setLoginError(result.error || 'Invalid credentials')
    }

    setLoadingLogin(false)
  }

  const handleRegisterSubmit = async (event) => {
    event.preventDefault()
    setLoadingRegister(true)
    setRegisterError('')

    if (registerForm.password !== registerForm.confirmPassword) {
      setRegisterError('Passwords do not match!')
      setLoadingRegister(false)
      return
    }

    const result = await register(registerForm.name, registerForm.email, registerForm.password)

    if (result.success) {
      navigate(routeForRole(result.data?.role || 'STUDENT'), { replace: true })
    } else {
      setRegisterError(result.error || 'Registration failed')
    }

    setLoadingRegister(false)
  }

  const handleLoginChange = (event) => {
    setLoginForm({ ...loginForm, [event.target.name]: event.target.value })
    if (loginError) setLoginError('')
  }

  const handleRegisterChange = (event) => {
    setRegisterForm({ ...registerForm, [event.target.name]: event.target.value })
    if (registerError) setRegisterError('')
  }

  const socialButtons = ['google', 'facebook', 'github']

  return (
    <main className="auth-page">
      <div className={`auth-card ${isActive ? 'active' : ''}`}>
        <div className="auth-form-panel auth-sign-up">
          <form onSubmit={handleRegisterSubmit} className="auth-form">
            <h1>Create Account</h1>
            <div className="auth-social-icons">
              {socialButtons.map((provider) => (
                <button key={provider} type="button" className="auth-social-btn" title={`Sign up with ${provider}`}>
                  <i className={`bi bi-${provider}`}></i>
                </button>
              ))}
            </div>
            <span>or use your email for registration</span>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={registerForm.name}
              onChange={handleRegisterChange}
              required
              disabled={loadingRegister}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={registerForm.email}
              onChange={handleRegisterChange}
              required
              disabled={loadingRegister}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={registerForm.password}
              onChange={handleRegisterChange}
              required
              disabled={loadingRegister}
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={registerForm.confirmPassword}
              onChange={handleRegisterChange}
              required
              disabled={loadingRegister}
            />
            {registerError && <div className="auth-error">{registerError}</div>}
            <button className="auth-submit-btn" type="submit" disabled={loadingRegister}>
              {loadingRegister ? 'Signing up...' : 'Sign Up'}
            </button>
          </form>
        </div>

        <div className="auth-form-panel auth-sign-in">
          <form onSubmit={handleLoginSubmit} className="auth-form">
            <h1>Sign In</h1>
            <div className="auth-social-icons">
              {socialButtons.map((provider) => (
                <button key={provider} type="button" className="auth-social-btn" title={`Sign in with ${provider}`}>
                  <i className={`bi bi-${provider}`}></i>
                </button>
              ))}
            </div>
            <span>or use your username & password</span>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={loginForm.username}
              onChange={handleLoginChange}
              required
              disabled={loadingLogin}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={loginForm.password}
              onChange={handleLoginChange}
              required
              disabled={loadingLogin}
            />
            <button className="auth-forgot-btn" type="button">Forgot Your Password?</button>
            {loginError && <div className="auth-error">{loginError}</div>}
            <button className="auth-submit-btn" type="submit" disabled={loadingLogin}>
              {loadingLogin ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        <div className="auth-toggle-container">
          <div className="auth-toggle">
            <div className="auth-toggle-panel auth-toggle-left">
              <h1>Welcome Back!</h1>
              <p class="text-white">To keep connected with us please login with your info</p>
              <button type="button" className="auth-ghost-btn" onClick={() => setIsActive(false)}>
                Sign In
              </button>
            </div>
            <div className="auth-toggle-panel auth-toggle-right">
              <h1>Hello, Friend!</h1>
              <p class="text-white">Enter your personal details and start journey with us</p>
              <button type="button" className="auth-ghost-btn" onClick={() => setIsActive(true)}>
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Auth
