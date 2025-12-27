export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'

export const TOURNAMENT_STATUSES = ['upcoming', 'in_progress', 'completed', 'cancelled'] as const
export const ENROLLMENT_STATUSES = ['pending', 'approved', 'rejected'] as const
export const CATEGORIES = [1, 2, 3, 4, 5, 6, 7, 8] as const

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  TOURNAMENTS: '/tournaments',
  TOURNAMENT_DETAILS: '/tournaments/:id',
  MY_ENROLLMENTS: '/enrollments',
  RANKINGS: '/rankings',
  PROFILE: '/profile',
  NOTIFICATIONS: '/notifications',
  ASSOCIATIONS: '/associations',
  ORGANIZER_CREATE: '/organizer/create',
  ORGANIZER_MANAGE: '/organizer/manage/:id',
} as const
