import { TournamentHistory } from '@/types/ranking'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCategory, formatDate } from '@/lib/utils'
import { Trophy, Users } from 'lucide-react'

interface TournamentStatisticsProps {
  tournaments: TournamentHistory[]
}

export function TournamentStatistics({ tournaments }: TournamentStatisticsProps) {
  if (tournaments.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No tournament history available yet
        </CardContent>
      </Card>
    )
  }

  const getPositionBadge = (position: number | null) => {
    if (!position) return <Badge variant="outline">Participated</Badge>
    if (position === 1) return <Badge className="bg-yellow-500">🥇 Champion</Badge>
    if (position === 2) return <Badge className="bg-gray-400">🥈 Runner-up</Badge>
    if (position === 3) return <Badge className="bg-orange-600">🥉 3rd Place</Badge>
    return <Badge variant="outline">#{position}</Badge>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Recent Tournament History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tournaments.map((tournament, index) => (
            <div
              key={`${tournament.tournamentId}-${index}`}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b last:border-0 last:pb-0"
            >
              <div className="flex-1">
                <div className="font-semibold mb-1">{tournament.tournamentName}</div>
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <span>{formatCategory(tournament.categoryId)}</span>
                  <span>•</span>
                  <span>{formatDate(tournament.completedAt)}</span>
                  {tournament.partnerName && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {tournament.partnerName}
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                {getPositionBadge(tournament.position)}
                <div className="text-right">
                  <div className="text-sm font-semibold text-primary">
                    +{tournament.pointsEarned} pts
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
