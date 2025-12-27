import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { enrollmentsApi } from '@/services/api/enrollments'
import { EnrollmentRequest } from '@/types/enrollment'
import { useToast } from './useToast'

export const useEnrollments = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const myEnrollmentsQuery = useQuery({
    queryKey: ['enrollments', 'me'],
    queryFn: enrollmentsApi.getMyEnrollments,
    staleTime: 1000 * 60 * 5,
  })

  const createEnrollmentMutation = useMutation({
    mutationFn: enrollmentsApi.createEnrollment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollments', 'me'] })
      toast({
        title: 'Enrollment submitted',
        description: 'Your enrollment request has been submitted successfully.',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Enrollment failed',
        description: error.response?.data?.message || 'Failed to submit enrollment request.',
        variant: 'destructive',
      })
    },
  })

  const approveEnrollmentMutation = useMutation({
    mutationFn: enrollmentsApi.approveEnrollment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollments'] })
      queryClient.invalidateQueries({ queryKey: ['tournaments'] })
      toast({
        title: 'Enrollment approved',
        description: 'The enrollment request has been approved.',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Approval failed',
        description: error.response?.data?.message || 'Failed to approve enrollment.',
        variant: 'destructive',
      })
    },
  })

  const rejectEnrollmentMutation = useMutation({
    mutationFn: enrollmentsApi.rejectEnrollment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollments'] })
      queryClient.invalidateQueries({ queryKey: ['tournaments'] })
      toast({
        title: 'Enrollment rejected',
        description: 'The enrollment request has been rejected.',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Rejection failed',
        description: error.response?.data?.message || 'Failed to reject enrollment.',
        variant: 'destructive',
      })
    },
  })

  return {
    myEnrollments: myEnrollmentsQuery.data,
    isLoadingEnrollments: myEnrollmentsQuery.isLoading,
    enrollmentsError: myEnrollmentsQuery.error,
    createEnrollment: (data: EnrollmentRequest) => createEnrollmentMutation.mutate(data),
    isCreatingEnrollment: createEnrollmentMutation.isPending,
    approveEnrollment: (enrollmentId: number) => approveEnrollmentMutation.mutate(enrollmentId),
    isApprovingEnrollment: approveEnrollmentMutation.isPending,
    rejectEnrollment: (enrollmentId: number) => rejectEnrollmentMutation.mutate(enrollmentId),
    isRejectingEnrollment: rejectEnrollmentMutation.isPending,
  }
}

export const useTournamentEnrollments = (tournamentId: number) => {
  const enrollmentsQuery = useQuery({
    queryKey: ['enrollments', 'tournament', tournamentId],
    queryFn: () => enrollmentsApi.getTournamentEnrollments(tournamentId),
    staleTime: 1000 * 60 * 5,
    enabled: !!tournamentId,
  })

  return {
    enrollments: enrollmentsQuery.data,
    isLoading: enrollmentsQuery.isLoading,
    error: enrollmentsQuery.error,
  }
}
