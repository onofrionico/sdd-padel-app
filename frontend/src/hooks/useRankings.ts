import { useQuery } from '@tanstack/react-query'
import { rankingsApi } from '@/services/api/rankings'
import { RankingsFilters } from '@/types/ranking'

export function useRankings(associationId: string | undefined, filters?: RankingsFilters & { seasonId?: string }) {
  return useQuery({
    queryKey: ['rankings', associationId, filters],
    queryFn: () => rankingsApi.list(associationId!, filters),
    enabled: !!associationId,
  })
}

export function useMyStatistics() {
  return useQuery({
    queryKey: ['my-statistics'],
    queryFn: () => rankingsApi.getMyStatistics(),
  })
}
