import { Ranking } from '@/types/ranking'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCategory } from '@/lib/utils'
import { Trophy, TrendingUp, TrendingDown } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface RankingsTableProps {
  rankings: Ranking[]
  highlightPlayerId?: number
}

export function RankingsTable({ rankings, highlightPlayerId }: RankingsTableProps) {
  const { user } = useAuth()
  const currentUserId = user?.id

  const getPositionBadge = (position: number) => {
    if (position === 1) return <Badge className="bg-yellow-500">🥇 1st</Badge>
    if (position === 2) return <Badge className="bg-gray-400">🥈 2nd</Badge>
    if (position === 3) return <Badge className="bg-orange-600">🥉 3rd</Badge>
    return <span className="font-semibold">#{position}</span>
  }

  const winRate = (ranking: Ranking) => {
    if (ranking.matchesPlayed === 0) return 0
    return ((ranking.matchesWon / ranking.matchesPlayed) * 100).toFixed(1)
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-4 font-semibold">Position</th>
              <th className="text-left p-4 font-semibold">Player</th>
              <th className="text-left p-4 font-semibold">Category</th>
              <th className="text-right p-4 font-semibold">Points</th>
              <th className="text-right p-4 font-semibold">Matches</th>
              <th className="text-right p-4 font-semibold">Win Rate</th>
              <th className="text-right p-4 font-semibold">Tournaments</th>
            </tr>
          </thead>
          <tbody>
            {rankings.map((ranking) => {
              const isCurrentUser = currentUserId === ranking.playerId
              const isHighlighted = highlightPlayerId === ranking.playerId
              
              return (
                <tr
                  key={ranking.id}
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
                    <div className="font-medium">{ranking.playerName}</div>
                    {isCurrentUser && (
                      <div className="text-xs text-muted-foreground">You</div>
                    )}
                  </td>
                  <td className="p-4">{formatCategory(ranking.categoryId)}</td>
                  <td className="p-4 text-right font-semibold">{ranking.points}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1 text-sm">
                      <span className="text-green-600">{ranking.matchesWon.toString()}</span>
                      <span className="text-muted-foreground">/</span>
                      <span className="text-red-600">{ranking.matchesLost.toString()}</span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {parseFloat(winRate(ranking)) >= 50 ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                      <span>{winRate(ranking)}%</span>
                    </div>
                  </td>
                  <td className="p-4 text-right">{ranking.tournamentsPlayed}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {rankings.map((ranking) => {
          const isCurrentUser = currentUserId === ranking.playerId
          const isHighlighted = highlightPlayerId === ranking.playerId
          
          return (
            <Card
              key={ranking.id}
              className={`p-4 ${isCurrentUser || isHighlighted ? 'border-primary' : ''}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getPositionBadge(ranking.position)}
                  {isCurrentUser && <Trophy className="h-4 w-4 text-primary" />}
                </div>
                <Badge variant="outline">{formatCategory(ranking.categoryId)}</Badge>
              </div>
              
              <div className="mb-2">
                <div className="font-semibold">{ranking.playerName}</div>
                {isCurrentUser && (
                  <div className="text-xs text-muted-foreground">You</div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-muted-foreground">Points</div>
                  <div className="font-semibold">{ranking.points}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Win Rate</div>
                  <div className="font-semibold flex items-center gap-1">
                    {parseFloat(winRate(ranking)) >= 50 ? (
                      <TrendingUp className="h-3 w-3 text-green-600" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-600" />
                    )}
                    {winRate(ranking)}%
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Matches</div>
                  <div className="font-semibold">
                    <span className="text-green-600">{ranking.matchesWon.toString()}</span>
                    <span className="text-muted-foreground"> / </span>
                    <span className="text-red-600">{ranking.matchesLost.toString()}</span>
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Tournaments</div>
                  <div className="font-semibold">{ranking.tournamentsPlayed}</div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
