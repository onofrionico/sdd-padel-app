import { apiClient } from './client'
import { Tournament, TournamentFilters, TournamentListResponse } from '@/types/tournament'

export const tournamentsApi = {
  list: async (filters?: TournamentFilters): Promise<TournamentListResponse> => {
    const params = new URLSearchParams()
    
    if (filters?.status) params.append('status', filters.status)
    if (filters?.category) params.append('category', filters.category.toString())
    if (filters?.search) params.append('search', filters.search)
    if (filters?.page) params.append('page', filters.page.toString())
    if (filters?.limit) params.append('limit', filters.limit.toString())

    const response = await apiClient.get<TournamentListResponse>(
      `/tournaments?${params.toString()}`
    )
    return response.data
  },

  getById: async (id: number): Promise<Tournament> => {
    const response = await apiClient.get<Tournament>(`/tournaments/${id}`)
    return response.data
  },

  create: async (tournament: Omit<Tournament, 'id' | 'createdAt' | 'updatedAt'>): Promise<Tournament> => {
    const response = await apiClient.post<Tournament>('/tournaments', tournament)
    return response.data
  },

  update: async (id: number, tournament: Partial<Tournament>): Promise<Tournament> => {
    const response = await apiClient.put<Tournament>(`/tournaments/${id}`, tournament)
    return response.data
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/tournaments/${id}`)
  },

  updateStatus: async (id: number, status: Tournament['status']): Promise<Tournament> => {
    const response = await apiClient.put<Tournament>(`/tournaments/${id}/status`, { status })
    return response.data
  },
}
