import { describe, it, expect, vi, beforeEach } from 'vitest'
import { rankingsApi } from '@/services/api/rankings'
import { apiClient } from '@/services/api/client'

vi.mock('@/services/api/client', () => ({
  apiClient: {
    get: vi.fn(),
  },
}))

describe('rankingsApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('list', () => {
    it('should fetch rankings without filters', async () => {
      const mockResponse = {
        data: {
          rankings: [],
          total: 0,
          page: 1,
          limit: 20,
        },
      }
      vi.mocked(apiClient.get).mockResolvedValue(mockResponse)

      const result = await rankingsApi.list('assoc-1')

      expect(apiClient.get).toHaveBeenCalledWith('/associations/assoc-1/rankings?')
      expect(result).toEqual(mockResponse.data)
    })

    it('should fetch rankings with filters', async () => {
      const mockResponse = {
        data: {
          rankings: [],
          total: 0,
          page: 1,
          limit: 20,
        },
      }
      vi.mocked(apiClient.get).mockResolvedValue(mockResponse)

      await rankingsApi.list('assoc-1', {
        categoryId: 3,
        page: 2,
        limit: 10,
      })

      expect(apiClient.get).toHaveBeenCalledWith('/associations/assoc-1/rankings?category=3&page=2&limit=10')
    })
  })

  describe('getMyStatistics', () => {
    it('should fetch current user statistics', async () => {
      const mockStats = {
        playerId: 1,
        totalPoints: 500,
        totalTournaments: 10,
        totalMatches: 50,
        matchesWon: 30,
        matchesLost: 20,
        winRate: 0.6,
        categoriesPlayed: [1, 2, 3],
        recentTournaments: [],
        bestRanking: null,
      }
      vi.mocked(apiClient.get).mockResolvedValue({ data: mockStats })

      const result = await rankingsApi.getMyStatistics()

      expect(apiClient.get).toHaveBeenCalledWith('/users/me/statistics')
      expect(result).toEqual(mockStats)
    })
  })

})
