import { Tournament } from '@/types/tournament'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, Trophy, Building2 } from 'lucide-react'
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
            {tournament.location && (
              <p className="text-muted-foreground mt-2 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {tournament.location}
              </p>
            )}
          </div>
          <Badge className="text-base px-4 py-2">
            {formatTournamentStatus(tournament.status)}
          </Badge>
        </div>
      </div>

      {tournament.association && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Association
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium text-lg">{tournament.association.name}</p>
              </div>
              {tournament.association.description && (
                <div>
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="text-muted-foreground">{tournament.association.description}</p>
                </div>
              )}
              {tournament.association.website && (
                <div>
                  <p className="text-sm text-muted-foreground">Website</p>
                  <a 
                    href={tournament.association.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {tournament.association.website}
                  </a>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

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
            {tournament.registrationDeadline && (
              <div>
                <p className="text-sm text-muted-foreground">Registration Deadline</p>
                <p className="font-medium">{formatDate(tournament.registrationDeadline)}</p>
              </div>
            )}
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
            {tournament.format && (
              <div>
                <p className="text-sm text-muted-foreground">Format</p>
                <p className="font-medium capitalize">
                  {tournament.format.replace(/_/g, ' ')}
                </p>
              </div>
            )}
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
          {tournament.categories && tournament.categories.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {tournament.categories.map((category) => (
                <Badge key={category} variant="outline" className="text-base px-4 py-2">
                  {formatCategory(category)}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No categories defined</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Point Distribution</CardTitle>
          <CardDescription>Points awarded for each position</CardDescription>
        </CardHeader>
        <CardContent>
          {tournament.pointDistribution && Object.keys(tournament.pointDistribution).length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {Object.entries(tournament.pointDistribution).map(([position, points]) => (
                <div key={position} className="flex flex-col items-center p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">{position}</p>
                  <p className="text-2xl font-bold">{points}</p>
                  <p className="text-xs text-muted-foreground">points</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No point distribution defined</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
