import { Tournament, getTournamentCategories } from '@/types/tournament'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Trophy, Building2 } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { formatTournamentStatus, formatCategory, formatTournamentType } from '@/lib/i18nUtils'
import { useTranslation } from 'react-i18next'

interface TournamentDetailsProps {
  tournament: Tournament
}

export function TournamentDetails({ tournament }: TournamentDetailsProps) {
  const { t } = useTranslation()
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{tournament.name}</h1>
            {tournament.description && (
              <p className="text-muted-foreground mt-2">{tournament.description}</p>
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
              {t('tournament.details.association')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-muted-foreground">{t('tournament.details.name')}</p>
                <p className="font-medium text-lg">{tournament.association.name}</p>
              </div>
              {tournament.association.description && (
                <div>
                  <p className="text-sm text-muted-foreground">{t('tournament.details.description')}</p>
                  <p className="text-muted-foreground">{tournament.association.description}</p>
                </div>
              )}
              {tournament.association.website && (
                <div>
                  <p className="text-sm text-muted-foreground">{t('tournament.details.website')}</p>
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
              {t('tournament.details.dates')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm text-muted-foreground">{t('tournament.details.startDate')}</p>
              <p className="font-medium">{formatDate(tournament.startDate)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('organizer.overview.endDate')}</p>
              <p className="font-medium">{tournament.endDate ? formatDate(tournament.endDate) : '-'}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              {t('tournament.details.format')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {tournament.type && (
              <div>
                <p className="text-sm text-muted-foreground">{t('organizer.overview.format')}</p>
                <p className="font-medium capitalize">
                  {formatTournamentType(tournament.type)}
                </p>
              </div>
            )}
            {tournament.settings?.maxTeams && (
              <div>
                <p className="text-sm text-muted-foreground">{t('organizer.overview.maxTeams')}</p>
                <p className="font-medium">{t('tournament.details.teams', { count: tournament.settings.maxTeams })}</p>
              </div>
            )}
            {tournament.settings?.teamSize && (
              <div>
                <p className="text-sm text-muted-foreground">{t('tournament.details.teamSize')}</p>
                <p className="font-medium">{tournament.settings.teamSize}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('organizer.overview.categories')}</CardTitle>
          <CardDescription>{t('tournament.details.categoriesDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          {getTournamentCategories(tournament).length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {getTournamentCategories(tournament).map((category) => (
                <Badge key={category} variant="outline" className="text-base px-4 py-2">
                  {formatCategory(category)}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">{t('tournament.details.noCategories')}</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('tournament.details.points')}</CardTitle>
          <CardDescription>{t('tournament.details.pointsDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          {tournament.settings?.pointsDistribution && Object.keys(tournament.settings.pointsDistribution).length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {Object.entries(tournament.settings.pointsDistribution).map(([position, points]) => (
                <div key={position} className="flex flex-col items-center p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">{position}</p>
                  <p className="text-2xl font-bold">{points}</p>
                  <p className="text-xs text-muted-foreground">{t('tournament.details.pointsUnit')}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">{t('tournament.details.noPoints')}</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
