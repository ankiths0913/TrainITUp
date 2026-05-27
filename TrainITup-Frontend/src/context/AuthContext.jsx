import { createContext, useState, useContext, useEffect } from 'react'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

  // Check if user is logged in on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    const storedUserId = localStorage.getItem('userId')
    const storedUserRole = localStorage.getItem('userRole')
    const storedUsername = localStorage.getItem('username')

    if (storedUserId) {
      setToken(storedToken)
      setUser({
        id: storedUserId,
        role: (storedUserRole || 'STUDENT').toUpperCase(),
        username: storedUsername
      })
    }
    setLoading(false)
  }, [])

  const login = async (username, password) => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      if (!response.ok) {
        throw new Error('Login failed')
      }

      const data = await response.json()
      const token = data.token || ''
      const id = data.id || data.userId
      const role = (data.role || 'STUDENT').toUpperCase()

      // Store in localStorage
      localStorage.setItem('token', token)
      localStorage.setItem('userId', id)
      localStorage.setItem('userRole', role)
      localStorage.setItem('username', username)

      // Update context
      setToken(token)
      setUser({ id, role, username })

      return { success: true, data: { ...data, token, id, role } }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const register = async (name, email, password) => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      })

      if (!response.ok) {
        throw new Error('Registration failed')
      }

      const data = await response.json()
      const token = data.token || ''
      const id = data.id || data.userId
      const role = (data.role || 'STUDENT').toUpperCase()

      // Store in localStorage
      localStorage.setItem('token', token)
      localStorage.setItem('userId', id)
      localStorage.setItem('userRole', role)
      localStorage.setItem('username', name)

      // Update context
      setToken(token)
      setUser({ id, role, username: name })

      return { success: true, data: { ...data, token, id, role } }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('userRole')
    localStorage.removeItem('username')
    setToken(null)
    setUser(null)
  }

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: Boolean(token || user?.id)
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider. Check that main.jsx wraps <App /> with <AuthProvider>.')
  }
  return context
}
