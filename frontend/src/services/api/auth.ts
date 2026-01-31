import { apiClient } from './client'
import { LoginRequest, RegisterRequest, AuthResponse, User, UpdateProfileRequest } from '@/types/user'

export const authApi = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials)
    return response.data
  },

  async register(data: RegisterRequest): Promise<User> {
    const response = await apiClient.post<User>('/auth/register', data)
    return response.data
  },

  async getProfile(): Promise<User> {
    const response = await apiClient.get<User>('/auth/profile')
    return response.data
  },

  async updateProfile(data: UpdateProfileRequest): Promise<User> {
    const response = await apiClient.put<User>('/auth/profile', data)
    return response.data
  },

  async uploadProfilePicture(file: File): Promise<{ profilePictureUrl: string }> {
    const formData = new FormData()
    formData.append('file', file)
    const response = await apiClient.post<{ profilePictureUrl: string }>('/users/me/profile-picture', formData)
    return response.data
  },
}
