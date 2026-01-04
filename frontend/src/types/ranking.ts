export interface RankingUser {
  id: string
  firstName: string
  lastName: string
}

export interface Ranking {
  position: number
  user: RankingUser
  points: number
  tournamentsCount: number
}

export interface PlayerStatistics {
  playerId: number
  totalPoints: number
  totalTournaments: number
  totalMatches: number
  matchesWon: number
  matchesLost: number
  winRate: number
  categoriesPlayed: number[]
  recentTournaments: TournamentHistory[]
  bestRanking: {
    categoryId: number
    position: number
    achievedAt: string
  } | null
}

export interface TournamentHistory {
  tournamentId: number
  tournamentName: string
  categoryId: number
  position: number | null
  pointsEarned: number
  partnerId: number | null
  partnerName: string | null
  completedAt: string
}

export interface RankingsFilters {
  categoryId?: number
  limit?: number
  page?: number
}

export interface RankingsResponse {
  items: Ranking[]
  count: number
  page: number
  pageSize: number
  season: {
    id: string
    name: string
    startDate: string
    endDate: string
  } | null
}
