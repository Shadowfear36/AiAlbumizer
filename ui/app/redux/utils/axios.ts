// app/utils/api.ts
import axios from 'axios'
import Router from 'next/router'

let hasTriedRefresh = false  // 🔁 prevent infinite loops

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true,
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Don't retry endlessly if refresh fails once
    if (error.response?.status === 401 && !originalRequest._retry && !hasTriedRefresh) {
      originalRequest._retry = true
      hasTriedRefresh = true

      try {
        await api.post('/token/refresh/')
        return api(originalRequest)
      } catch (refreshError) {
        console.error('Refresh token failed', refreshError)
        Router.push('/')
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default api
