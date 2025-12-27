import { describe, it, expect, vi, beforeEach } from 'vitest'
import { tournamentsApi } from '@/services/api/tournaments'
import { apiClient } from '@/services/api/client'

vi.mock('@/services/api/client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}))

describe('tournamentsApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('list', () => {
    it('should fetch tournaments without filters', async () => {
      const mockResponse = {
        data: {
          tournaments: [],
          total: 0,
          page: 1,
          limit: 12,
        },
      }
      vi.mocked(apiClient.get).mockResolvedValue(mockResponse)

      const result = await tournamentsApi.list()

      expect(apiClient.get).toHaveBeenCalledWith('/tournaments?')
      expect(result).toEqual(mockResponse.data)
    })

    it('should fetch tournaments with filters', async () => {
      const mockResponse = {
        data: {
          tournaments: [],
          total: 0,
          page: 1,
          limit: 12,
        },
      }
      vi.mocked(apiClient.get).mockResolvedValue(mockResponse)

      await tournamentsApi.list({
        status: 'upcoming',
        category: 3,
        search: 'test',
        page: 2,
        limit: 10,
      })

      expect(apiClient.get).toHaveBeenCalledWith(
        '/tournaments?status=upcoming&category=3&search=test&page=2&limit=10'
      )
    })
  })

  describe('getById', () => {
    it('should fetch tournament by id', async () => {
      const mockTournament = { id: 1, name: 'Test Tournament' }
      vi.mocked(apiClient.get).mockResolvedValue({ data: mockTournament })

      const result = await tournamentsApi.getById(1)

      expect(apiClient.get).toHaveBeenCalledWith('/tournaments/1')
      expect(result).toEqual(mockTournament)
    })
  })

  describe('create', () => {
    it('should create a tournament', async () => {
      const newTournament = {
        name: 'New Tournament',
        associationId: 1,
        startDate: '2024-07-01',
        endDate: '2024-07-03',
        registrationDeadline: '2024-06-25',
        location: 'Test Location',
        format: 'single_elimination' as const,
        categories: [1, 2],
        status: 'upcoming' as const,
        pointDistribution: {},
        showCapacity: true,
      }
      const mockResponse = { data: { ...newTournament, id: 1 } }
      vi.mocked(apiClient.post).mockResolvedValue(mockResponse)

      const result = await tournamentsApi.create(newTournament)

      expect(apiClient.post).toHaveBeenCalledWith('/tournaments', newTournament)
      expect(result).toEqual(mockResponse.data)
    })
  })

  describe('update', () => {
    it('should update a tournament', async () => {
      const updates = { name: 'Updated Name' }
      const mockResponse = { data: { id: 1, ...updates } }
      vi.mocked(apiClient.put).mockResolvedValue(mockResponse)

      const result = await tournamentsApi.update(1, updates)

      expect(apiClient.put).toHaveBeenCalledWith('/tournaments/1', updates)
      expect(result).toEqual(mockResponse.data)
    })
  })

  describe('delete', () => {
    it('should delete a tournament', async () => {
      vi.mocked(apiClient.delete).mockResolvedValue({ data: undefined })

      await tournamentsApi.delete(1)

      expect(apiClient.delete).toHaveBeenCalledWith('/tournaments/1')
    })
  })

  describe('updateStatus', () => {
    it('should update tournament status', async () => {
      const mockResponse = { data: { id: 1, status: 'in_progress' } }
      vi.mocked(apiClient.put).mockResolvedValue(mockResponse)

      const result = await tournamentsApi.updateStatus(1, 'in_progress')

      expect(apiClient.put).toHaveBeenCalledWith('/tournaments/1/status', {
        status: 'in_progress',
      })
      expect(result).toEqual(mockResponse.data)
    })
  })
})
