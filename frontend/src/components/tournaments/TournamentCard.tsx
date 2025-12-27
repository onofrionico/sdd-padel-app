import { Link } from 'react-router-dom'
import { Tournament } from '@/types/tournament'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, Users } from 'lucide-react'
import { formatDate, formatTournamentStatus, formatCategory } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface TournamentCardProps {
  tournament: Tournament
  className?: string
}

export function TournamentCard({ tournament, className }: TournamentCardProps) {
  const statusColors = {
    upcoming: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    in_progress: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    completed: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  }

  return (
    <Link to={`/tournaments/${tournament.id}`}>
      <Card className={cn('hover:shadow-lg transition-shadow cursor-pointer', className)}>
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-xl line-clamp-2">{tournament.name}</CardTitle>
            <Badge className={statusColors[tournament.status]}>
              {formatTournamentStatus(tournament.status)}
            </Badge>
          </div>
          <CardDescription className="flex items-center gap-1 text-sm">
            <MapPin className="h-4 w-4" />
            {tournament.location}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(tournament.startDate)}</span>
            {tournament.startDate !== tournament.endDate && (
              <>
                <span>-</span>
                <span>{formatDate(tournament.endDate)}</span>
              </>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {tournament.categories.map((category) => (
              <Badge key={category} variant="outline">
                {formatCategory(category)}
              </Badge>
            ))}
          </div>

          {tournament.showCapacity && tournament.maxTeams && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>
                Capacity: {tournament.maxTeams} teams
              </span>
            </div>
          )}

          <div className="text-sm text-muted-foreground">
            Format: <span className="font-medium">{tournament.format.replace('_', ' ')}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
