export interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  phoneNumber?: string
  gender?: 'male' | 'female' | 'other'
  dateOfBirth?: string
  playingHand?: 'right' | 'left' | 'ambidextrous'
  playingStyle?: 'defensive' | 'offensive' | 'all_around'
  role: 'player' | 'organizer' | 'admin'
  createdAt: string
  updatedAt: string
}

export interface PlayerProfile {
  id: number
  userId: number
  playingHand: 'right' | 'left' | 'ambidextrous'
  playingStyle: 'defensive' | 'offensive' | 'all_around'
  skillLevel?: number
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
  firstName: string
  lastName: string
  phoneNumber?: string
  gender?: 'male' | 'female' | 'other'
  dateOfBirth?: string
  playingHand?: 'right' | 'left' | 'ambidextrous'
  playingStyle?: 'defensive' | 'offensive' | 'all_around'
}

export interface AuthResponse {
  user: User
  access_token: string
}

export interface UpdateProfileRequest {
  firstName?: string
  lastName?: string
  phoneNumber?: string
  gender?: 'male' | 'female' | 'other'
  dateOfBirth?: string
  playingHand?: 'right' | 'left' | 'ambidextrous'
  playingStyle?: 'defensive' | 'offensive' | 'all_around'
}
