import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, AuthResponse } from '@/types/user'
import { storage } from '@/services/storage'
import { apiClient } from '@/services/api/client'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  updateUser: (user: User) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      const token = storage.getToken()
      if (token) {
        try {
          const response = await apiClient.get<AuthResponse>('/auth/profile')
          setUser(response.data.user)
        } catch (error) {
          storage.removeToken()
        }
      }
      setIsLoading(false)
    }

    initAuth()
  }, [])

  const login = async (email: string, password: string) => {
    const response = await apiClient.post<AuthResponse>('/auth/login', { email, password })
    const { user: userData, token } = response.data
    storage.setToken(token)
    setUser(userData)
  }

  const logout = () => {
    storage.removeToken()
    setUser(null)
    window.location.href = '/login'
  }

  const updateUser = (userData: User) => {
    setUser(userData)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
