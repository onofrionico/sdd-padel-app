import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { tournamentsApi } from '@/services/api/tournaments'
import { getTournamentCategories } from '@/types/tournament'
import { formatTournamentType } from '@/lib/i18nUtils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { Trophy, Plus, Calendar, Users, AlertCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function OrganizerDashboardPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const { data: tournamentsData, isLoading, error } = useQuery({
    queryKey: ['organizer-tournaments'],
    queryFn: () => tournamentsApi.list({ limit: 100 }),
  })

  const tournaments = tournamentsData?.tournaments || []
  const upcomingTournaments = tournaments.filter((x) => x.status === 'upcoming' || x.status === 'registration_open')
  const inProgressTournaments = tournaments.filter((x) => x.status === 'in_progress')
  const completedTournaments = tournaments.filter((t) => t.status === 'completed')

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
          <span>{t('organizer.dashboard.loadFailed')}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{t('organizer.dashboard.title')}</h1>
          <p className="text-muted-foreground">
            {t('organizer.dashboard.subtitle')}
          </p>
        </div>
        <Button onClick={() => navigate('/organizer/tournaments/create')}>
          <Plus className="h-4 w-4 mr-2" />
          {t('organizer.create.title')}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>{t('organizer.dashboard.stats.total')}</CardDescription>
            <CardTitle className="text-3xl">{tournaments.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Trophy className="h-4 w-4" />
              <span>{t('organizer.dashboard.stats.allTime')}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>{t('tournament.status.upcoming')}</CardDescription>
            <CardTitle className="text-3xl">{upcomingTournaments.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{t('organizer.dashboard.stats.scheduled')}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>{t('tournament.status.inProgress')}</CardDescription>
            <CardTitle className="text-3xl">{inProgressTournaments.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{t('organizer.dashboard.stats.activeNow')}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>{t('tournament.status.completed')}</CardDescription>
            <CardTitle className="text-3xl">{completedTournaments.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Trophy className="h-4 w-4" />
              <span>{t('organizer.dashboard.stats.finished')}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Tournaments */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">{t('organizer.dashboard.upcomingTitle')}</h2>
          <Button variant="outline" onClick={() => navigate('/tournaments')}>
            {t('organizer.dashboard.viewAll')}
          </Button>
        </div>
        {upcomingTournaments.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">{t('organizer.dashboard.noUpcoming')}</p>
              <Button onClick={() => navigate('/organizer/tournaments/create')}>
                <Plus className="h-4 w-4 mr-2" />
                {t('organizer.dashboard.createFirst')}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingTournaments.slice(0, 6).map((tournament) => (
              <Card
                key={tournament.id}
                className="cursor-pointer hover:bg-accent transition-colors"
                onClick={() => navigate(`/organizer/tournaments/${tournament.id}`)}
              >
                <CardHeader>
                  <CardTitle>{tournament.name}</CardTitle>
                  <CardDescription>
                    {new Date(tournament.startDate).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">{t('organizer.overview.format')}:</span>
                      <span>{formatTournamentType(tournament.type)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">{t('organizer.overview.categories')}:</span>
                      <span>{getTournamentCategories(tournament).join(', ') || '-'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* In Progress Tournaments */}
      {inProgressTournaments.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">{t('organizer.dashboard.activeTitle')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {inProgressTournaments.map((tournament) => (
              <Card
                key={tournament.id}
                className="cursor-pointer hover:bg-accent transition-colors border-primary"
                onClick={() => navigate(`/organizer/tournaments/${tournament.id}`)}
              >
                <CardHeader>
                  <CardTitle>{tournament.name}</CardTitle>
                  <CardDescription>
                    {t('organizer.dashboard.started', { date: new Date(tournament.startDate).toLocaleDateString() })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">{t('organizer.dashboard.status')}:</span>
                      <span className="text-primary font-medium">{t('tournament.status.inProgress')}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
