import { Association } from './association'

// Refleja la entidad `Tournament` del backend (backend/src/tournaments/entities/tournament.entity.ts)

export type TournamentType = 'single_elimination' | 'double_elimination' | 'round_robin' | 'groups_knockout'

export type TournamentStatus = 'upcoming' | 'registration_open' | 'in_progress' | 'completed' | 'cancelled'

export interface TournamentSettings {
  maxTeams?: number
  minTeams?: number
  teamSize?: number
  categoryRange?: {
    min: number
    max: number
  }
  pointsDistribution?: Record<string, number>
  tiebreakers?: string[]
}

export interface TournamentPaymentSettings {
  requiresDeposit?: boolean
  depositAmount?: number
  depositCurrency?: string
  totalFee?: number
  paymentDeadlineHours?: number
  allowTeamPayment?: boolean
  allowSplitPayment?: boolean
  platformFeePercentage?: number
  refundPolicy?: {
    fullRefundDeadlineHours?: number
    partialRefundPercentage?: number
    noRefundDeadlineHours?: number
    refundPlatformFee?: boolean
  }
}

export interface Tournament {
  id: string
  name: string
  description?: string | null
  associationId: string
  association?: Association
  startDate: string
  endDate?: string | null
  type: TournamentType
  status: TournamentStatus
  settings: TournamentSettings
  paymentSettings?: TournamentPaymentSettings
  isPublic: boolean
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

/** Categorías habilitadas según `settings.categoryRange` (ej. min 1, max 3 → [1, 2, 3]). */
export function getTournamentCategories(tournament: Pick<Tournament, 'settings'>): number[] {
  const range = tournament.settings?.categoryRange
  if (!range) return []
  const out: number[] = []
  for (let c = range.min; c <= range.max; c++) out.push(c)
  return out
}

