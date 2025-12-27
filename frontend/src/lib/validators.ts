import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  phoneNumber: z.string().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  dateOfBirth: z.string().optional(),
  playingHand: z.enum(['right', 'left', 'ambidextrous']).optional(),
  playingStyle: z.enum(['defensive', 'offensive', 'all_around']).optional(),
})

export const playerProfileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters').optional(),
  lastName: z.string().min(2, 'Last name must be at least 2 characters').optional(),
  phoneNumber: z.string().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  dateOfBirth: z.string().optional(),
  playingHand: z.enum(['right', 'left', 'ambidextrous']).optional(),
  playingStyle: z.enum(['defensive', 'offensive', 'all_around']).optional(),
})

export const tournamentSchema = z.object({
  name: z.string().min(3, 'Tournament name must be at least 3 characters'),
  description: z.string().optional(),
  startDate: z.string(),
  endDate: z.string().optional(),
  type: z.enum(['single_elimination', 'double_elimination', 'round_robin', 'groups_knockout']),
  isPublic: z.boolean().default(false),
  associationId: z.string().uuid(),
  settings: z.object({
    maxTeams: z.number().min(2).optional(),
    minTeams: z.number().min(2).optional(),
    teamSize: z.number().min(1).max(4).default(2),
    categoryRange: z.object({
      min: z.number().min(1).max(8),
      max: z.number().min(1).max(8),
    }).optional(),
    pointsDistribution: z.record(z.string(), z.number()).default({
      '1': 100,
      '2': 70,
      '3': 50,
      '4': 30,
    }),
    tiebreakers: z.array(z.string()).default(['head_to_head', 'point_difference', 'points_scored']),
  }),
}).refine((data) => {
  if (data.endDate && data.startDate) {
    return new Date(data.endDate) >= new Date(data.startDate)
  }
  return true
}, {
  message: 'End date must be after start date',
  path: ['endDate'],
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
