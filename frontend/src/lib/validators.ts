import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
})

export const playerProfileSchema = z.object({
  playingHand: z.enum(['right', 'left']),
  skillLevel: z.number().min(1).max(10),
  profilePicture: z.string().url().optional(),
})

export const tournamentSchema = z.object({
  name: z.string().min(3, 'Tournament name must be at least 3 characters'),
  startDate: z.string(),
  endDate: z.string(),
  registrationDeadline: z.string(),
  location: z.string().min(3, 'Location must be at least 3 characters'),
  format: z.enum(['single_elimination', 'double_elimination', 'round_robin', 'groups_knockout']),
  maxTeams: z.number().optional(),
  categories: z.array(z.number().min(1).max(8)),
  showCapacity: z.boolean(),
})

export const enrollmentSchema = z.object({
  tournamentId: z.number(),
  partnerId: z.number(),
  category: z.number().min(1).max(8),
})

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type PlayerProfileFormData = z.infer<typeof playerProfileSchema>
export type TournamentFormData = z.infer<typeof tournamentSchema>
export type EnrollmentFormData = z.infer<typeof enrollmentSchema>
