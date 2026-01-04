import { apiClient } from './client'
import { 
  Association, 
  AssociationMembership, 
  CreateMembershipRequest, 
  UpdateCategoryRequest 
} from '@/types/association'

export const associationsApi = {
  list: async (): Promise<Association[]> => {
    const response = await apiClient.get<Association[]>('/associations')
    return response.data
  },

  getById: async (id: string): Promise<Association> => {
    const response = await apiClient.get<Association>(`/associations/${id}`)
    return response.data
  },

  addMembership: async (
    associationId: string, 
    data: CreateMembershipRequest
  ): Promise<AssociationMembership> => {
    const response = await apiClient.post<AssociationMembership>(
      `/associations/${associationId}/memberships`,
      data
    )
    return response.data
  },

  removeMembership: async (associationId: string, userId: string): Promise<void> => {
    await apiClient.delete(`/associations/${associationId}/memberships/${userId}`)
  },

  updateMemberCategory: async (
    associationId: string,
    userId: string,
    data: UpdateCategoryRequest
  ): Promise<AssociationMembership> => {
    const response = await apiClient.put<AssociationMembership>(
      `/associations/${associationId}/members/${userId}/category`,
      data
    )
    return response.data
  },

  getMemberCategory: async (
    associationId: string,
    userId: string
  ): Promise<{ category: number | null }> => {
    const response = await apiClient.get<{ category: number | null }>(
      `/associations/${associationId}/members/${userId}/category`
    )
    return response.data
  },
}
