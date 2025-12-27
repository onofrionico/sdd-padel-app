import { useQuery } from '@tanstack/react-query'
import { rankingsApi } from '@/services/api/rankings'
import { RankingsFilters } from '@/types/ranking'

export function useRankings(filters?: RankingsFilters) {
  return useQuery({
    queryKey: ['rankings', filters],
    queryFn: () => rankingsApi.list(filters),
  })
}

export function usePlayerStatistics(playerId: number) {
  return useQuery({
    queryKey: ['player-statistics', playerId],
    queryFn: () => rankingsApi.getPlayerStatistics(playerId),
    enabled: !!playerId,
  })
}

export function useMyStatistics() {
  return useQuery({
    queryKey: ['my-statistics'],
    queryFn: () => rankingsApi.getMyStatistics(),
  })
}

export function usePlayerRanking(playerId: number, categoryId?: number) {
  return useQuery({
    queryKey: ['player-ranking', playerId, categoryId],
    queryFn: () => rankingsApi.getPlayerRanking(playerId, categoryId),
    enabled: !!playerId,
  })
}
