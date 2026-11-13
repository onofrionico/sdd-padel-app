import { apiClient } from './client'
import { RankingsFilters, RankingsResponse, PlayerStatistics } from '@/types/ranking'

export const rankingsApi = {
  async list(associationId: string, filters?: RankingsFilters & { seasonId?: string }): Promise<RankingsResponse> {
    const params = new URLSearchParams()
    
    if (filters?.categoryId) params.append('category', filters.categoryId.toString())
    if (filters?.page) params.append('page', filters.page.toString())
    if (filters?.limit) params.append('limit', filters.limit.toString())
    if (filters?.seasonId) params.append('seasonId', filters.seasonId)
    
    const response = await apiClient.get<RankingsResponse>(`/associations/${associationId}/rankings?${params}`)
    return response.data
  },

  async getMyStatistics(): Promise<PlayerStatistics> {
    const response = await apiClient.get<PlayerStatistics>('/users/me/statistics')
    return response.data
  },
}
