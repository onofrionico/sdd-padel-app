import { apiClient } from './client'
import { Enrollment, EnrollmentRequest, EnrollmentWithDetails } from '@/types/enrollment'
import { ApiResponse } from '@/types/api'

export const enrollmentsApi = {
  createEnrollment: async (data: EnrollmentRequest): Promise<Enrollment> => {
    const response = await apiClient.post<ApiResponse<Enrollment>>(
      `/tournaments/${data.tournamentId}/enrollments`,
      data
    )
    return response.data.data
  },

  getMyEnrollments: async (): Promise<EnrollmentWithDetails[]> => {
    const response = await apiClient.get<ApiResponse<EnrollmentWithDetails[]>>(
      '/users/me/enrollments'
    )
    return response.data.data
  },

  getTournamentEnrollments: async (tournamentId: number): Promise<Enrollment[]> => {
    const response = await apiClient.get<ApiResponse<Enrollment[]>>(
      `/tournaments/${tournamentId}/enrollments`
    )
    return response.data.data
  },

  approveEnrollment: async (enrollmentId: number): Promise<Enrollment> => {
    const response = await apiClient.put<ApiResponse<Enrollment>>(
      `/enrollments/${enrollmentId}/approve`
    )
    return response.data.data
  },

  rejectEnrollment: async (enrollmentId: number): Promise<Enrollment> => {
    const response = await apiClient.put<ApiResponse<Enrollment>>(
      `/enrollments/${enrollmentId}/reject`
    )
    return response.data.data
  },
}
