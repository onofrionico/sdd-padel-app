import { apiClient } from './client'

export interface Season {
  id: string
  associationId: string
  name: string
  startDate: string
  endDate: string
  createdAt: string
  updatedAt: string
}

export const seasonsApi = {
  async list(associationId: string): Promise<Season[]> {
    const response = await apiClient.get<Season[]>(`/associations/${associationId}/seasons`)
    return response.data
  },

  async getCurrent(associationId: string, date?: string): Promise<Season> {
    const params = date ? `?date=${date}` : ''
    const response = await apiClient.get<Season>(`/associations/${associationId}/seasons/current${params}`)
    return response.data
  },
}
