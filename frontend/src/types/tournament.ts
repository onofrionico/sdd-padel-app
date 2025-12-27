export interface Tournament {
  id: number
  name: string
  associationId: number
  startDate: string
  endDate: string
  registrationDeadline: string
  location: string
  format: 'single_elimination' | 'double_elimination' | 'round_robin' | 'groups_knockout'
  maxTeams?: number
  categories: number[]
  status: 'upcoming' | 'in_progress' | 'completed' | 'cancelled'
  pointDistribution: Record<string, number>
  showCapacity: boolean
  createdAt: string
  updatedAt: string
}

export interface TournamentFilters {
  status?: string
  category?: number
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
