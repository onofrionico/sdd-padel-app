export interface User {
  id: number
  email: string
  fullName: string
  phoneNumber: string
  role: 'player' | 'organizer' | 'admin'
  createdAt: string
  updatedAt: string
}

export interface PlayerProfile {
  id: number
  userId: number
  playingHand: 'right' | 'left'
  skillLevel: number
  profilePicture?: string
  createdAt: string
  updatedAt: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  fullName: string
  phoneNumber: string
}

export interface AuthResponse {
  user: User
  token: string
}
