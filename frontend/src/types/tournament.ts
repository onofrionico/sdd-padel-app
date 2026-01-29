import { Association } from './association'

export interface Tournament {
  id: string
  name: string
  associationId: string
  association?: Association
  startDate: string
  endDate: string
  registrationDeadline: string
  location: string
  format: 'single_elimination' | 'double_elimination' | 'round_robin' | 'groups_knockout'
  maxTeams?: number
  categories: number[]
  status: 'upcoming' | 'registration_open' | 'in_progress' | 'completed' | 'cancelled'
  pointDistribution: Record<string, number>
  showCapacity: boolean
  createdAt: string
  updatedAt: string
}

export interface TournamentFilters {
  status?: string
  category?: number
  associationId?: string
  search?: string
  page?: number
  limit?: number
}

export interface TournamentListResponse {
  tournaments: Tournament[]
  total: number
  page: number
  limit: number
}
