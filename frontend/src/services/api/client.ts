import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { API_BASE_URL } from '@/lib/constants'
import { storage } from '@/services/storage'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 30000,
})

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = storage.getToken()
    console.log('API Request:', config.method?.toUpperCase(), config.url, 'FormData:', config.data instanceof FormData)
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    if (config.headers && !config.headers['Content-Type'] && !(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json'
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

apiClient.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.config.url, response.status, response.data)
    return response
  },
  (error: AxiosError) => {
    console.error('API Error:', error.config?.url, error.response?.status, error.response?.data)
    if (error.response?.status === 401) {
      console.error('401 Unauthorized - Logging out')
      storage.removeToken()
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)
