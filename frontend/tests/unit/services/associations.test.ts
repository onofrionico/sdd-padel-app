import { describe, it, expect, vi, beforeEach } from 'vitest'
import { associationsApi } from '@/services/api/associations'
import { apiClient } from '@/services/api/client'

vi.mock('@/services/api/client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}))

describe('associationsApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('list', () => {
    it('should fetch all associations', async () => {
      const mockAssociations = [
        {
          id: '1',
          name: 'Test Association',
          description: 'Test description',
          isActive: true,
          pointsByRound: {},
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
      ]
      vi.mocked(apiClient.get).mockResolvedValue({ data: mockAssociations })

      const result = await associationsApi.list()

      expect(apiClient.get).toHaveBeenCalledWith('/associations')
      expect(result).toEqual(mockAssociations)
    })
  })

  describe('getById', () => {
    it('should fetch association by id', async () => {
      const mockAssociation = {
        id: '1',
        name: 'Test Association',
        description: 'Test description',
        isActive: true,
        pointsByRound: {},
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      }
      vi.mocked(apiClient.get).mockResolvedValue({ data: mockAssociation })

      const result = await associationsApi.getById('1')

      expect(apiClient.get).toHaveBeenCalledWith('/associations/1')
      expect(result).toEqual(mockAssociation)
    })
  })

  describe('addMembership', () => {
    it('should add membership to association', async () => {
      const membershipData = {
        userId: 'user-1',
        role: 'member' as const,
        category: 3,
      }
      const mockMembership = {
        id: 'membership-1',
        userId: 'user-1',
        associationId: 'assoc-1',
        role: 'member' as const,
        category: 3,
        points: 0,
        joinedAt: '2024-01-01',
        updatedAt: '2024-01-01',
      }
      vi.mocked(apiClient.post).mockResolvedValue({ data: mockMembership })

      const result = await associationsApi.addMembership('assoc-1', membershipData)

      expect(apiClient.post).toHaveBeenCalledWith(
        '/associations/assoc-1/memberships',
        membershipData
      )
      expect(result).toEqual(mockMembership)
    })
  })

  describe('removeMembership', () => {
    it('should remove membership from association', async () => {
      vi.mocked(apiClient.delete).mockResolvedValue({ data: undefined })

      await associationsApi.removeMembership('assoc-1', 'user-1')

      expect(apiClient.delete).toHaveBeenCalledWith('/associations/assoc-1/memberships/user-1')
    })
  })

  describe('updateMemberCategory', () => {
    it('should update member category', async () => {
      const categoryData = { category: 5 }
      const mockMembership = {
        id: 'membership-1',
        userId: 'user-1',
        associationId: 'assoc-1',
        role: 'member' as const,
        category: 5,
        points: 0,
        joinedAt: '2024-01-01',
        updatedAt: '2024-01-01',
      }
      vi.mocked(apiClient.put).mockResolvedValue({ data: mockMembership })

      const result = await associationsApi.updateMemberCategory('assoc-1', 'user-1', categoryData)

      expect(apiClient.put).toHaveBeenCalledWith(
        '/associations/assoc-1/members/user-1/category',
        categoryData
      )
      expect(result).toEqual(mockMembership)
    })
  })

  describe('getMemberCategory', () => {
    it('should get member category', async () => {
      const mockResponse = { category: 4 }
      vi.mocked(apiClient.get).mockResolvedValue({ data: mockResponse })

      const result = await associationsApi.getMemberCategory('assoc-1', 'user-1')

      expect(apiClient.get).toHaveBeenCalledWith('/associations/assoc-1/members/user-1/category')
      expect(result).toEqual(mockResponse)
    })

    it('should handle null category', async () => {
      const mockResponse = { category: null }
      vi.mocked(apiClient.get).mockResolvedValue({ data: mockResponse })

      const result = await associationsApi.getMemberCategory('assoc-1', 'user-1')

      expect(result).toEqual(mockResponse)
    })
  })
})
