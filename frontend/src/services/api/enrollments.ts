import { apiClient } from './client'
import { Enrollment, EnrollmentRequest, EnrollmentWithDetails } from '@/types/enrollment'

export interface EnrollmentDecisionParams {
  tournamentId: string
  enrollmentId: string
  rejectionReason?: string
}

export const enrollmentsApi = {
  createEnrollment: async (data: EnrollmentRequest): Promise<Enrollment> => {
    const { tournamentId, ...body } = data
    const response = await apiClient.post<Enrollment>(`/tournaments/${tournamentId}/enrollments`, body)
    return response.data
  },

  getMyEnrollments: async (): Promise<EnrollmentWithDetails[]> => {
    const response = await apiClient.get<EnrollmentWithDetails[]>('/users/me/enrollments')
    return response.data
  },

  getTournamentEnrollments: async (tournamentId: string): Promise<EnrollmentWithDetails[]> => {
    const response = await apiClient.get<EnrollmentWithDetails[]>(`/tournaments/${tournamentId}/enrollments`)
    return response.data
  },

  approveEnrollment: async ({ tournamentId, enrollmentId }: EnrollmentDecisionParams): Promise<Enrollment> => {
    const response = await apiClient.put<Enrollment>(
      `/tournaments/${tournamentId}/enrollments/${enrollmentId}/decision`,
      { decision: 'approved' }
    )
    return response.data
  },

  rejectEnrollment: async ({ tournamentId, enrollmentId, rejectionReason }: EnrollmentDecisionParams): Promise<Enrollment> => {
    const response = await apiClient.put<Enrollment>(
      `/tournaments/${tournamentId}/enrollments/${enrollmentId}/decision`,
      { decision: 'rejected', ...(rejectionReason ? { rejectionReason } : {}) }
    )
    return response.data
  },
}
