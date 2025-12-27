import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { tournamentsApi } from '@/services/api/tournaments'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { Trophy, Plus, Calendar, Users, AlertCircle } from 'lucide-react'

export function OrganizerDashboardPage() {
  const navigate = useNavigate()

  const { data: tournamentsData, isLoading, error } = useQuery({
    queryKey: ['organizer-tournaments'],
    queryFn: () => tournamentsApi.list({ limit: 100 }),
  })

  const tournaments = tournamentsData?.tournaments || []
  const upcomingTournaments = tournaments.filter((t) => t.status === 'upcoming')
  const inProgressTournaments = tournaments.filter((t) => t.status === 'in_progress')
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
          <span>Failed to load tournaments. Please try again.</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Organizer Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your tournaments and enrollments
          </p>
        </div>
        <Button onClick={() => navigate('/organizer/tournaments/create')}>
          <Plus className="h-4 w-4 mr-2" />
          Create Tournament
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Tournaments</CardDescription>
            <CardTitle className="text-3xl">{tournaments.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Trophy className="h-4 w-4" />
              <span>All time</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Upcoming</CardDescription>
            <CardTitle className="text-3xl">{upcomingTournaments.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Scheduled</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>In Progress</CardDescription>
            <CardTitle className="text-3xl">{inProgressTournaments.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>Active now</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Completed</CardDescription>
            <CardTitle className="text-3xl">{completedTournaments.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Trophy className="h-4 w-4" />
              <span>Finished</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Tournaments */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Upcoming Tournaments</h2>
          <Button variant="outline" onClick={() => navigate('/tournaments')}>
            View All
          </Button>
        </div>
        {upcomingTournaments.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">No upcoming tournaments</p>
              <Button onClick={() => navigate('/organizer/tournaments/create')}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Tournament
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
                      <span className="text-muted-foreground">Location:</span>
                      <span>{tournament.location}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Format:</span>
                      <span className="capitalize">{tournament.format.replace('_', ' ')}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Categories:</span>
                      <span>{tournament.categories.length}</span>
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
          <h2 className="text-2xl font-bold mb-4">Active Tournaments</h2>
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
                    Started {new Date(tournament.startDate).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Location:</span>
                      <span>{tournament.location}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <span className="text-primary font-medium">In Progress</span>
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
