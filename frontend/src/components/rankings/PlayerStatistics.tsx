import { PlayerStatistics as PlayerStatsType } from '@/types/ranking'
import { StatCard } from '@/components/common/StatCard'
import { Trophy, Target, TrendingUp, Award } from 'lucide-react'
import { formatCategory } from '@/lib/utils'

interface PlayerStatisticsProps {
  statistics: PlayerStatsType
}

export function PlayerStatistics({ statistics }: PlayerStatisticsProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Points"
          value={statistics.totalPoints}
          icon={Trophy}
          description="Accumulated ranking points"
        />
        <StatCard
          title="Tournaments"
          value={statistics.totalTournaments}
          icon={Award}
          description="Tournaments participated"
        />
        <StatCard
          title="Win Rate"
          value={`${(statistics.winRate * 100).toFixed(1)}%`}
          icon={TrendingUp}
          description={`${statistics.matchesWon}W - ${statistics.matchesLost}L`}
        />
        <StatCard
          title="Total Matches"
          value={statistics.totalMatches}
          icon={Target}
          description="Matches played"
        />
      </div>

      {statistics.bestRanking && (
        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold mb-2">Best Ranking Achievement</h3>
          <div className="flex items-center gap-4">
            <div className="text-3xl">🏆</div>
            <div>
              <div className="font-semibold">
                Position #{statistics.bestRanking.position}
              </div>
              <div className="text-sm text-muted-foreground">
                {formatCategory(statistics.bestRanking.categoryId)} •{' '}
                {new Date(statistics.bestRanking.achievedAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      )}

      {statistics.categoriesPlayed.length > 0 && (
        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold mb-3">Categories Played</h3>
          <div className="flex flex-wrap gap-2">
            {statistics.categoriesPlayed.map((categoryId) => (
              <span
                key={categoryId}
                className="px-3 py-1 rounded-full bg-primary/10 text-sm font-medium"
              >
                {formatCategory(categoryId)}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
