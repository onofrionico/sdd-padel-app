import { useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { enrollmentsApi } from '@/services/api/enrollments'
import { EnrollmentWithDetails } from '@/types/enrollment'
import { EnrollmentRequestCard } from '@/components/organizer/EnrollmentRequestCard'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { useToast } from '@/hooks/useToast'
import { AlertCircle, Users } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useTranslation } from 'react-i18next'

export function ManageEnrollmentsPage() {
  const { id } = useParams<{ id: string }>()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  const { data: enrollments, isLoading, error } = useQuery<EnrollmentWithDetails[]>({
    queryKey: ['tournament-enrollments', id],
    queryFn: () => enrollmentsApi.getTournamentEnrollments(id!),
    enabled: !!id,
  })

  const approveMutation = useMutation({
    mutationFn: (enrollmentId: string) => enrollmentsApi.approveEnrollment({ tournamentId: id!, enrollmentId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournament-enrollments', id] })
      toast({
        title: t('common.success'),
        description: t('organizer.toast.enrollmentApproved'),
      })
    },
    onError: (error: any) => {
      toast({
        title: t('common.error'),
        description: error.response?.data?.message || t('organizer.toast.enrollmentApproveFailed'),
        variant: 'destructive',
      })
    },
  })

  const rejectMutation = useMutation({
    mutationFn: ({ enrollmentId, rejectionReason }: { enrollmentId: string; rejectionReason?: string }) =>
      enrollmentsApi.rejectEnrollment({ tournamentId: id!, enrollmentId, rejectionReason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournament-enrollments', id] })
      toast({
        title: t('common.success'),
        description: t('organizer.toast.enrollmentRejected'),
      })
    },
    onError: (error: any) => {
      toast({
        title: t('common.error'),
        description: error.response?.data?.message || t('organizer.toast.enrollmentRejectFailed'),
        variant: 'destructive',
      })
    },
  })

  // El motivo del rechazo queda guardado en la inscripción (rejectionReason)
  const handleReject = (enrollmentId: string) => {
    const reason = window.prompt(t('organizer.enrollments.rejectReasonPrompt'))
    if (reason === null) return
    rejectMutation.mutate({ enrollmentId, rejectionReason: reason.trim() || undefined })
  }

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
          <span>{t('organizer.enrollments.loadFailed')}</span>
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
        <h1 className="text-3xl font-bold mb-2">{t('organizer.enrollments.title')}</h1>
        <p className="text-muted-foreground">
          {t('organizer.enrollments.subtitle')}
        </p>
      </div>

      {/* Pending Enrollments */}
      <div>
        <h2 className="text-2xl font-bold mb-4">
          {t('organizer.enrollments.pending', { count: pendingEnrollments.length })}
        </h2>
        {pendingEnrollments.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>{t('organizer.enrollments.noPending')}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingEnrollments.map((enrollment) => (
              <EnrollmentRequestCard
                key={enrollment.id}
                enrollment={enrollment}
                onApprove={approveMutation.mutate}
                onReject={handleReject}
                isLoading={approveMutation.isPending || rejectMutation.isPending}
              />
            ))}
          </div>
        )}
      </div>

      {/* Approved Enrollments */}
      <div>
        <h2 className="text-2xl font-bold mb-4">
          {t('organizer.enrollments.approved', { count: approvedEnrollments.length })}
        </h2>
        {approvedEnrollments.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              <p>{t('organizer.enrollments.noApproved')}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {approvedEnrollments.map((enrollment) => (
              <EnrollmentRequestCard
                key={enrollment.id}
                enrollment={enrollment}
                onApprove={approveMutation.mutate}
                onReject={handleReject}
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
            {t('organizer.enrollments.rejected', { count: rejectedEnrollments.length })}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rejectedEnrollments.map((enrollment) => (
              <EnrollmentRequestCard
                key={enrollment.id}
                enrollment={enrollment}
                onApprove={approveMutation.mutate}
                onReject={handleReject}
                isLoading={approveMutation.isPending || rejectMutation.isPending}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
