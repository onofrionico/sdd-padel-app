import { useQuery } from '@tanstack/react-query'
import { seasonsApi } from '@/services/api/seasons'

export function useSeasons(associationId: string | undefined) {
  return useQuery({
    queryKey: ['seasons', associationId],
    queryFn: () => seasonsApi.list(associationId!),
    enabled: !!associationId,
  })
}

export function useCurrentSeason(associationId: string | undefined, date?: string) {
  return useQuery({
    queryKey: ['current-season', associationId, date],
    queryFn: () => seasonsApi.getCurrent(associationId!, date),
    enabled: !!associationId,
  })
}
