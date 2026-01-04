import { apiClient } from './client'
import { Ranking, RankingsFilters, RankingsResponse, PlayerStatistics } from '@/types/ranking'

export const rankingsApi = {
  async list(associationId: string, filters?: RankingsFilters): Promise<RankingsResponse> {
    const params = new URLSearchParams()
    
    if (filters?.categoryId) params.append('category', filters.categoryId.toString())
    if (filters?.page) params.append('page', filters.page.toString())
    if (filters?.limit) params.append('limit', filters.limit.toString())
    
    const response = await apiClient.get<RankingsResponse>(`/associations/${associationId}/rankings?${params}`)
    return response.data
  },

  async getPlayerStatistics(playerId: number): Promise<PlayerStatistics> {
    const response = await apiClient.get<PlayerStatistics>(`/players/${playerId}/statistics`)
    return response.data
  },

  async getMyStatistics(): Promise<PlayerStatistics> {
    const response = await apiClient.get<PlayerStatistics>('/players/me/statistics')
    return response.data
  },

  async getPlayerRanking(playerId: number, categoryId?: number): Promise<Ranking | null> {
    const params = categoryId ? `?categoryId=${categoryId}` : ''
    const response = await apiClient.get<Ranking | null>(`/players/${playerId}/ranking${params}`)
    return response.data
  },
}
