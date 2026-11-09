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
    return response
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      storage.removeToken()
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)
