import { Ranking } from '@/types/ranking'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trophy } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useTranslation } from 'react-i18next'

interface RankingsTableProps {
  rankings: Ranking[]
  highlightPlayerId?: string
}

export function RankingsTable({ rankings, highlightPlayerId }: RankingsTableProps) {
  const { user } = useAuth()
  const { t } = useTranslation()
  const currentUserId = user?.id.toString()

  const getPositionBadge = (position: number) => {
    if (position === 1) return <Badge className="bg-yellow-500">{t('rankings.position.first')}</Badge>
    if (position === 2) return <Badge className="bg-gray-400">{t('rankings.position.second')}</Badge>
    if (position === 3) return <Badge className="bg-orange-600">{t('rankings.position.third')}</Badge>
    return <span className="font-semibold">#{position}</span>
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-4 font-semibold">{t('rankings.table.position')}</th>
              <th className="text-left p-4 font-semibold">{t('rankings.table.player')}</th>
              <th className="text-right p-4 font-semibold">{t('rankings.table.points')}</th>
              <th className="text-right p-4 font-semibold">{t('rankings.table.tournaments')}</th>
            </tr>
          </thead>
          <tbody>
            {rankings.map((ranking) => {
              const isCurrentUser = currentUserId === ranking.user.id
              const isHighlighted = highlightPlayerId === ranking.user.id
              
              return (
                <tr
                  key={ranking.user.id}
                  className={`border-b transition-colors hover:bg-muted/50 ${
                    isCurrentUser || isHighlighted ? 'bg-primary/5' : ''
                  }`}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {getPositionBadge(ranking.position)}
                      {isCurrentUser && <Trophy className="h-4 w-4 text-primary" />}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium">{ranking.user.firstName} {ranking.user.lastName}</div>
                    {isCurrentUser && (
                      <div className="text-xs text-muted-foreground">{t('rankings.table.you')}</div>
                    )}
                  </td>
                  <td className="p-4 text-right font-semibold">{ranking.points}</td>
                  <td className="p-4 text-right">{ranking.tournamentsCount}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {rankings.map((ranking) => {
          const isCurrentUser = currentUserId === ranking.user.id
          const isHighlighted = highlightPlayerId === ranking.user.id
          
          return (
            <Card
              key={ranking.user.id}
              className={`p-4 ${isCurrentUser || isHighlighted ? 'border-primary' : ''}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getPositionBadge(ranking.position)}
                  {isCurrentUser && <Trophy className="h-4 w-4 text-primary" />}
                </div>
              </div>
              
              <div className="mb-2">
                <div className="font-semibold">{ranking.user.firstName} {ranking.user.lastName}</div>
                {isCurrentUser && (
                  <div className="text-xs text-muted-foreground">{t('rankings.table.you')}</div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-muted-foreground">{t('rankings.table.points')}</div>
                  <div className="font-semibold">{ranking.points}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">{t('rankings.table.tournaments')}</div>
                  <div className="font-semibold">{ranking.tournamentsCount}</div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
