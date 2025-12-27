export interface Ranking {
  id: number
  playerId: number
  playerName: string
  categoryId: number
  points: number
  position: number
  matchesPlayed: number
  matchesWon: number
  matchesLost: number
  tournamentsPlayed: number
  updatedAt: string
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
  rankings: Ranking[]
  total: number
  page: number
  limit: number
}
