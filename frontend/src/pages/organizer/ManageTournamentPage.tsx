import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { tournamentsApi } from '@/services/api/tournaments'
import { enrollmentsApi } from '@/services/api/enrollments'
import { Tournament, getTournamentCategories } from '@/types/tournament'
import { formatTournamentType } from '@/lib/i18nUtils'
import { EnrollmentWithDetails } from '@/types/enrollment'
import { TournamentStatusSelector } from '@/components/organizer/TournamentStatusSelector'
import { ParticipantsList } from '@/components/organizer/ParticipantsList'
import { EnrollmentRequestCard } from '@/components/organizer/EnrollmentRequestCard'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { AlertCircle, Edit, Trash2, Users, Calendar, DollarSign } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function ManageTournamentPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<'overview' | 'enrollments' | 'participants' | 'payments'>('overview')

  const { data: tournament, isLoading: tournamentLoading, error: tournamentError } = useQuery({
    queryKey: ['tournament', id],
    queryFn: () => tournamentsApi.getById(id!),
    enabled: !!id,
  })

  const { data: enrollments, isLoading: enrollmentsLoading } = useQuery<EnrollmentWithDetails[]>({
    queryKey: ['tournament-enrollments', id],
    queryFn: () => enrollmentsApi.getTournamentEnrollments(id!),
    enabled: !!id,
  })

  const updateStatusMutation = useMutation({
    mutationFn: (status: Tournament['status']) => tournamentsApi.updateStatus(id!, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournament', id] })
      toast({
        title: t('common.success'),
        description: t('organizer.toast.statusUpdated'),
      })
    },
    onError: (error: any) => {
      toast({
        title: t('common.error'),
        description: error.response?.data?.message || t('organizer.toast.statusUpdateFailed'),
        variant: 'destructive',
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: () => tournamentsApi.delete(id!),
    onSuccess: () => {
      toast({
        title: t('common.success'),
        description: t('organizer.toast.deleted'),
      })
      navigate('/organizer/tournaments')
    },
    onError: (error: any) => {
      toast({
        title: t('common.error'),
        description: error.response?.data?.message || t('organizer.toast.deleteFailed'),
        variant: 'destructive',
      })
    },
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

  if (tournamentLoading) {
    return (
      <div className="container py-8 flex justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (tournamentError || !tournament) {
    return (
      <div className="container py-8">
        <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-4 text-destructive">
          <AlertCircle className="h-5 w-5" />
          <span>{t('organizer.loadTournamentFailed')}</span>
        </div>
      </div>
    )
  }

  const pendingEnrollments = enrollments?.filter((e) => e.status === 'pending') || []
  const approvedEnrollments = enrollments?.filter((e) => e.status === 'approved') || []

  return (
    <div className="container py-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">{tournament.name}</h1>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{new Date(tournament.startDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{t('organizer.teamsEnrolled', { count: approvedEnrollments.length })}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/organizer/tournaments/${id}/edit`)}
          >
            <Edit className="h-4 w-4 mr-2" />
            {t('common.edit')}
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              if (confirm(t('organizer.confirmDelete'))) {
                deleteMutation.mutate()
              }
            }}
            disabled={deleteMutation.isPending}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {t('common.delete')}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-2 px-1 border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {t('organizer.tabs.overview')}
          </button>
          <button
            onClick={() => setActiveTab('enrollments')}
            className={`pb-2 px-1 border-b-2 transition-colors ${
              activeTab === 'enrollments'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {t('organizer.tabs.enrollments')} {pendingEnrollments.length > 0 && (
              <span className="ml-1 bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                {pendingEnrollments.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('participants')}
            className={`pb-2 px-1 border-b-2 transition-colors ${
              activeTab === 'participants'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {t('organizer.tabs.participants')}
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`pb-2 px-1 border-b-2 transition-colors ${
              activeTab === 'payments'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <DollarSign className="h-4 w-4 inline mr-1" />
            {t('organizer.tabs.payments')}
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('organizer.overview.statusTitle')}</CardTitle>
              <CardDescription>{t('organizer.overview.statusDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <TournamentStatusSelector
                currentStatus={tournament.status}
                onChange={(status) => updateStatusMutation.mutate(status)}
                disabled={updateStatusMutation.isPending}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('organizer.overview.detailsTitle')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t('organizer.overview.format')}</p>
                  <p className="text-base">{formatTournamentType(tournament.type)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t('organizer.overview.maxTeams')}</p>
                  <p className="text-base">{tournament.settings?.maxTeams || t('organizer.overview.unlimited')}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t('organizer.overview.categories')}</p>
                  <p className="text-base">{getTournamentCategories(tournament).join(', ') || '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t('organizer.overview.endDate')}</p>
                  <p className="text-base">
                    {tournament.endDate ? new Date(tournament.endDate).toLocaleDateString() : '-'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'enrollments' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-4">
              {t('organizer.enrollments.pending', { count: pendingEnrollments.length })}
            </h2>
            {enrollmentsLoading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : pendingEnrollments.length === 0 ? (
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
        </div>
      )}

      {activeTab === 'participants' && (
        <div>
          {enrollmentsLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : (
            <ParticipantsList enrollments={enrollments || []} />
          )}
        </div>
      )}

      {activeTab === 'payments' && (
        <div>
          <Button
            variant="outline"
            onClick={() => navigate(`/organizer/tournaments/${id}/payments`)}
            className="mb-4"
          >
            <DollarSign className="h-4 w-4 mr-2" />
            {t('organizer.payments.viewDashboard')}
          </Button>
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="mb-2">{t('organizer.payments.title')}</p>
              <p className="text-sm">{t('organizer.payments.description')}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
