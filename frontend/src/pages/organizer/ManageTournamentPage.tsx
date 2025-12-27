import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { tournamentsApi } from '@/services/api/tournaments'
import { enrollmentsApi } from '@/services/api/enrollments'
import { Tournament } from '@/types/tournament'
import { EnrollmentWithDetails } from '@/types/enrollment'
import { TournamentStatusSelector } from '@/components/organizer/TournamentStatusSelector'
import { ParticipantsList } from '@/components/organizer/ParticipantsList'
import { EnrollmentRequestCard } from '@/components/organizer/EnrollmentRequestCard'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { AlertCircle, Edit, Trash2, Users, Calendar, MapPin } from 'lucide-react'

export function ManageTournamentPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState<'overview' | 'enrollments' | 'participants'>('overview')

  const { data: tournament, isLoading: tournamentLoading, error: tournamentError } = useQuery({
    queryKey: ['tournament', id],
    queryFn: () => tournamentsApi.getById(Number(id)),
    enabled: !!id,
  })

  const { data: enrollments, isLoading: enrollmentsLoading } = useQuery<EnrollmentWithDetails[]>({
    queryKey: ['tournament-enrollments', id],
    queryFn: () => enrollmentsApi.getTournamentEnrollments(Number(id)) as Promise<EnrollmentWithDetails[]>,
    enabled: !!id,
  })

  const updateStatusMutation = useMutation({
    mutationFn: (status: Tournament['status']) => tournamentsApi.updateStatus(Number(id), status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournament', id] })
      toast({
        title: 'Success',
        description: 'Tournament status updated successfully',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update status',
        variant: 'destructive',
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: () => tournamentsApi.delete(Number(id)),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Tournament deleted successfully',
      })
      navigate('/organizer/tournaments')
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete tournament',
        variant: 'destructive',
      })
    },
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
          <span>Failed to load tournament. Please try again.</span>
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
              <MapPin className="h-4 w-4" />
              <span>{tournament.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{approvedEnrollments.length} teams enrolled</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/organizer/tournaments/${id}/edit`)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              if (confirm('Are you sure you want to delete this tournament?')) {
                deleteMutation.mutate()
              }
            }}
            disabled={deleteMutation.isPending}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
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
            Overview
          </button>
          <button
            onClick={() => setActiveTab('enrollments')}
            className={`pb-2 px-1 border-b-2 transition-colors ${
              activeTab === 'enrollments'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Enrollments {pendingEnrollments.length > 0 && (
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
            Participants
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tournament Status</CardTitle>
              <CardDescription>Update the current status of the tournament</CardDescription>
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
              <CardTitle>Tournament Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Format</p>
                  <p className="text-base capitalize">{tournament.format.replace('_', ' ')}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Max Teams</p>
                  <p className="text-base">{tournament.maxTeams || 'Unlimited'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Categories</p>
                  <p className="text-base">{tournament.categories.join(', ')}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Registration Deadline</p>
                  <p className="text-base">
                    {new Date(tournament.registrationDeadline).toLocaleDateString()}
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
              Pending Requests ({pendingEnrollments.length})
            </h2>
            {enrollmentsLoading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : pendingEnrollments.length === 0 ? (
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
    </div>
  )
}
