import { useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { enrollmentsApi } from '@/services/api/enrollments'
import { EnrollmentWithDetails } from '@/types/enrollment'
import { EnrollmentRequestCard } from '@/components/organizer/EnrollmentRequestCard'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { useToast } from '@/hooks/useToast'
import { AlertCircle, Users } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export function ManageEnrollmentsPage() {
  const { id } = useParams<{ id: string }>()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { data: enrollments, isLoading, error } = useQuery<EnrollmentWithDetails[]>({
    queryKey: ['tournament-enrollments', id],
    queryFn: () => enrollmentsApi.getTournamentEnrollments(Number(id)) as Promise<EnrollmentWithDetails[]>,
    enabled: !!id,
  })

  const approveMutation = useMutation({
    mutationFn: (enrollmentId: number) => enrollmentsApi.approveEnrollment(enrollmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournament-enrollments', id] })
      toast({
        title: 'Success',
        description: 'Enrollment approved successfully',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to approve enrollment',
        variant: 'destructive',
      })
    },
  })

  const rejectMutation = useMutation({
    mutationFn: (enrollmentId: number) => enrollmentsApi.rejectEnrollment(enrollmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournament-enrollments', id] })
      toast({
        title: 'Success',
        description: 'Enrollment rejected',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to reject enrollment',
        variant: 'destructive',
      })
    },
  })

  if (isLoading) {
    return (
      <div className="container py-8 flex justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-8">
        <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-4 text-destructive">
          <AlertCircle className="h-5 w-5" />
          <span>Failed to load enrollments. Please try again.</span>
        </div>
      </div>
    )
  }

  const pendingEnrollments = enrollments?.filter((e) => e.status === 'pending') || []
  const approvedEnrollments = enrollments?.filter((e) => e.status === 'approved') || []
  const rejectedEnrollments = enrollments?.filter((e) => e.status === 'rejected') || []

  return (
    <div className="container py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Manage Enrollments</h1>
        <p className="text-muted-foreground">
          Review and process tournament enrollment requests
        </p>
      </div>

      {/* Pending Enrollments */}
      <div>
        <h2 className="text-2xl font-bold mb-4">
          Pending Requests ({pendingEnrollments.length})
        </h2>
        {pendingEnrollments.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No pending enrollment requests</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingEnrollments.map((enrollment) => (
              <EnrollmentRequestCard
                key={enrollment.id}
                enrollment={enrollment}
                onApprove={approveMutation.mutate}
                onReject={rejectMutation.mutate}
                isLoading={approveMutation.isPending || rejectMutation.isPending}
              />
            ))}
          </div>
        )}
      </div>

      {/* Approved Enrollments */}
      <div>
        <h2 className="text-2xl font-bold mb-4">
          Approved ({approvedEnrollments.length})
        </h2>
        {approvedEnrollments.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              <p>No approved enrollments yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {approvedEnrollments.map((enrollment) => (
              <EnrollmentRequestCard
                key={enrollment.id}
                enrollment={enrollment}
                onApprove={approveMutation.mutate}
                onReject={rejectMutation.mutate}
                isLoading={approveMutation.isPending || rejectMutation.isPending}
              />
            ))}
          </div>
        )}
      </div>

      {/* Rejected Enrollments */}
      {rejectedEnrollments.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">
            Rejected ({rejectedEnrollments.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rejectedEnrollments.map((enrollment) => (
              <EnrollmentRequestCard
                key={enrollment.id}
                enrollment={enrollment}
                onApprove={approveMutation.mutate}
                onReject={rejectMutation.mutate}
                isLoading={approveMutation.isPending || rejectMutation.isPending}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
