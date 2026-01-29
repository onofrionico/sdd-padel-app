import { Link } from 'react-router-dom'
import { Tournament } from '@/types/tournament'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, Users, Building2 } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { formatTournamentStatus, formatCategory } from '@/lib/i18nUtils'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'

interface TournamentCardProps {
  tournament: Tournament
  className?: string
}

export function TournamentCard({ tournament, className }: TournamentCardProps) {
  const { t } = useTranslation()
  
  const statusColors = {
    upcoming: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    registration_open: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300',
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
          {tournament.location && (
            <CardDescription className="flex items-center gap-1 text-sm">
              <MapPin className="h-4 w-4" />
              {tournament.location}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-3">
          {tournament.association && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building2 className="h-4 w-4" />
              <span className="font-medium">{tournament.association.name}</span>
            </div>
          )}

          {tournament.startDate && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(tournament.startDate)}</span>
              {tournament.endDate && tournament.startDate !== tournament.endDate && (
                <>
                  <span>-</span>
                  <span>{formatDate(tournament.endDate)}</span>
                </>
              )}
            </div>
          )}

          {tournament.categories && tournament.categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tournament.categories.map((category) => (
                <Badge key={category} variant="outline">
                  {formatCategory(category)}
                </Badge>
              ))}
            </div>
          )}

          {tournament.showCapacity && tournament.maxTeams && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>
                {t('tournament.card.capacity', { maxTeams: tournament.maxTeams })}
              </span>
            </div>
          )}

          {tournament.format && (
            <div className="text-sm text-muted-foreground">
              {t('tournament.card.format')} <span className="font-medium">{tournament.format.replace('_', ' ')}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
