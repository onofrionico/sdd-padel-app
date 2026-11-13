import { PlayerStatistics as PlayerStatsType } from '@/types/ranking'
import { StatCard } from '@/components/common/StatCard'
import { Trophy, Target, TrendingUp, Award } from 'lucide-react'
import { formatCategory } from '@/lib/i18nUtils'
import { useTranslation } from 'react-i18next'

interface PlayerStatisticsProps {
  statistics: PlayerStatsType
}

export function PlayerStatistics({ statistics }: PlayerStatisticsProps) {
  const { t } = useTranslation()
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={t('rankings.stats.totalPoints')}
          value={statistics.totalPoints}
          icon={Trophy}
          description={t('rankings.stats.totalPointsDescription')}
        />
        <StatCard
          title={t('rankings.table.tournaments')}
          value={statistics.totalTournaments}
          icon={Award}
          description={t('rankings.stats.tournamentsDescription')}
        />
        <StatCard
          title={t('rankings.stats.winRate')}
          value={`${(statistics.winRate * 100).toFixed(1)}%`}
          icon={TrendingUp}
          description={`${statistics.matchesWon}W - ${statistics.matchesLost}L`}
        />
        <StatCard
          title={t('rankings.stats.totalMatches')}
          value={statistics.totalMatches}
          icon={Target}
          description={t('rankings.stats.matchesDescription')}
        />
      </div>

      {statistics.bestRanking && (
        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold mb-2">{t('rankings.stats.best')}</h3>
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
          <h3 className="font-semibold mb-3">{t('rankings.stats.categoriesPlayed')}</h3>
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
