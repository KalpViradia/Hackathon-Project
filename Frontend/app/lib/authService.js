import axios from 'axios'
import Cookies from 'js-cookie'

const API_URL = 'http://localhost:5000/api'

export const authService = {
  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      })
      
      if (response.data.token) {
        Cookies.set('token', response.data.token, { expires: 7 })
        localStorage.setItem('user', JSON.stringify(response.data))
      }
      
      return response.data
    } catch (error) {
      throw error.response?.data || { message: error.message }
    }
  },

  signup: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/auth/signup`, userData)
      
      if (response.data.token) {
        Cookies.set('token', response.data.token, { expires: 7 })
        localStorage.setItem('user', JSON.stringify(response.data))
      }
      
      return response.data
    } catch (error) {
      throw error.response?.data || { message: error.message }
    }
  },

  logout: async () => {
    try {
      const token = Cookies.get('token')
      if (token) {
        await axios.post(`${API_URL}/auth/logout`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        })
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      Cookies.remove('token')
      localStorage.removeItem('user')
    }
  },

  getCurrentUser: () => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user')
      return user ? JSON.parse(user) : null
    }
    return null
  },

  getToken: () => {
    return Cookies.get('token')
  }
}