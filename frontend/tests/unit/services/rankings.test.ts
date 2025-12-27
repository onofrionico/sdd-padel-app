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

      const result = await rankingsApi.list()

      expect(apiClient.get).toHaveBeenCalledWith('/rankings?')
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

      await rankingsApi.list({
        categoryId: 3,
        page: 2,
        limit: 10,
      })

      expect(apiClient.get).toHaveBeenCalledWith('/rankings?categoryId=3&page=2&limit=10')
    })
  })

  describe('getPlayerStatistics', () => {
    it('should fetch player statistics by id', async () => {
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

      const result = await rankingsApi.getPlayerStatistics(1)

      expect(apiClient.get).toHaveBeenCalledWith('/players/1/statistics')
      expect(result).toEqual(mockStats)
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

      expect(apiClient.get).toHaveBeenCalledWith('/players/me/statistics')
      expect(result).toEqual(mockStats)
    })
  })

  describe('getPlayerRanking', () => {
    it('should fetch player ranking without category', async () => {
      const mockRanking = {
        id: 1,
        playerId: 1,
        playerName: 'Test Player',
        categoryId: 3,
        points: 500,
        position: 5,
        matchesPlayed: 50,
        matchesWon: 30,
        matchesLost: 20,
        tournamentsPlayed: 10,
        updatedAt: '2024-01-01',
      }
      vi.mocked(apiClient.get).mockResolvedValue({ data: mockRanking })

      const result = await rankingsApi.getPlayerRanking(1)

      expect(apiClient.get).toHaveBeenCalledWith('/players/1/ranking')
      expect(result).toEqual(mockRanking)
    })

    it('should fetch player ranking with category filter', async () => {
      const mockRanking = {
        id: 1,
        playerId: 1,
        playerName: 'Test Player',
        categoryId: 3,
        points: 500,
        position: 5,
        matchesPlayed: 50,
        matchesWon: 30,
        matchesLost: 20,
        tournamentsPlayed: 10,
        updatedAt: '2024-01-01',
      }
      vi.mocked(apiClient.get).mockResolvedValue({ data: mockRanking })

      const result = await rankingsApi.getPlayerRanking(1, 3)

      expect(apiClient.get).toHaveBeenCalledWith('/players/1/ranking?categoryId=3')
      expect(result).toEqual(mockRanking)
    })
  })
})
