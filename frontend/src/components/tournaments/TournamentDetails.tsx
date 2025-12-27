import { Tournament } from '@/types/tournament'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, Trophy } from 'lucide-react'
import { formatDate, formatTournamentStatus, formatCategory } from '@/lib/utils'

interface TournamentDetailsProps {
  tournament: Tournament
}

export function TournamentDetails({ tournament }: TournamentDetailsProps) {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{tournament.name}</h1>
            <p className="text-muted-foreground mt-2 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {tournament.location}
            </p>
          </div>
          <Badge className="text-base px-4 py-2">
            {formatTournamentStatus(tournament.status)}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Tournament Dates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm text-muted-foreground">Start Date</p>
              <p className="font-medium">{formatDate(tournament.startDate)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">End Date</p>
              <p className="font-medium">{formatDate(tournament.endDate)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Registration Deadline</p>
              <p className="font-medium">{formatDate(tournament.registrationDeadline)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Tournament Format
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm text-muted-foreground">Format</p>
              <p className="font-medium capitalize">
                {tournament.format.replace(/_/g, ' ')}
              </p>
            </div>
            {tournament.maxTeams && (
              <div>
                <p className="text-sm text-muted-foreground">Maximum Teams</p>
                <p className="font-medium">{tournament.maxTeams} teams</p>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">Capacity Visible</p>
              <p className="font-medium">{tournament.showCapacity ? 'Yes' : 'No'}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
          <CardDescription>Available categories for this tournament</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {tournament.categories.map((category) => (
              <Badge key={category} variant="outline" className="text-base px-4 py-2">
                {formatCategory(category)}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Point Distribution</CardTitle>
          <CardDescription>Points awarded for each position</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Object.entries(tournament.pointDistribution).map(([position, points]) => (
              <div key={position} className="flex flex-col items-center p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">{position}</p>
                <p className="text-2xl font-bold">{points}</p>
                <p className="text-xs text-muted-foreground">points</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
