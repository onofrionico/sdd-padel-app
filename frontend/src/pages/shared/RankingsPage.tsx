import { useState } from 'react'
import { useRankings } from '@/hooks/useRankings'
import { useAssociations } from '@/hooks/useAssociations'
import { useSeasons } from '@/hooks/useSeasons'
import { RankingsTable } from '@/components/rankings/RankingsTable'
import { CategoryFilter } from '@/components/rankings/CategoryFilter'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function RankingsPage() {
  const { t } = useTranslation()
  const { data: associations, isLoading: loadingAssociations } = useAssociations()
  const [selectedAssociationId, setSelectedAssociationId] = useState<string | undefined>(undefined)
  const [selectedSeasonId, setSelectedSeasonId] = useState<string | undefined>(undefined)
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined)
  const [page, setPage] = useState(1)
  const limit = 20

  // Auto-select first association when loaded
  if (associations && associations.length > 0 && !selectedAssociationId) {
    setSelectedAssociationId(associations[0].id)
  }

  const { data: seasons, isLoading: loadingSeasons } = useSeasons(selectedAssociationId)

  const { data, isLoading, error } = useRankings(selectedAssociationId, {
    categoryId,
    page,
    limit,
    seasonId: selectedSeasonId,
  })

  const totalPages = data ? Math.ceil(data.count / limit) : 0

  if (loadingAssociations || isLoading) {
    return (
      <div className="container py-8">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!associations || associations.length === 0) {
    return (
      <div className="container py-8">
        <div className="rounded-lg border bg-muted/50 p-8 text-center">
          <p className="text-muted-foreground">
            {t('rankings.page.needAssociation')}
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-8">
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-center">
          <p className="text-destructive">{t('rankings.page.loadFailed')}</p>
        </div>
      </div>
    )
  }

  const rankings = data?.items || []

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('rankings.page.title')}</h1>
        <p className="text-muted-foreground">
          {t('rankings.page.subtitle')}
        </p>
      </div>

      <div className="mb-6 space-y-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('tournament.details.association')}</label>
              <Select 
                value={selectedAssociationId} 
                onValueChange={(value) => {
                  setSelectedAssociationId(value)
                  setSelectedSeasonId(undefined)
                }}
              >
                <SelectTrigger className="w-[250px]">
                  <SelectValue placeholder={t('rankings.page.selectAssociation')} />
                </SelectTrigger>
                <SelectContent>
                  {associations.map((assoc) => (
                    <SelectItem key={assoc.id} value={assoc.id}>
                      {assoc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t('rankings.page.season')}</label>
              <Select 
                value={selectedSeasonId || 'current'} 
                onValueChange={(value) => setSelectedSeasonId(value === 'current' ? undefined : value)}
                disabled={!selectedAssociationId || loadingSeasons}
              >
                <SelectTrigger className="w-[250px]">
                  <SelectValue placeholder={t('rankings.page.selectSeason')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">{t('rankings.page.currentSeason')}</SelectItem>
                  {seasons?.map((season) => (
                    <SelectItem key={season.id} value={season.id}>
                      {season.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t('rankings.page.category')}</label>
              <CategoryFilter value={categoryId} onChange={setCategoryId} />
            </div>
          </div>
          
          {data && (
            <div className="text-sm text-muted-foreground">
              {t('rankings.page.showing', { shown: rankings.length, total: data.count })}
              {data.season && ` • ${data.season.name}`}
            </div>
          )}
        </div>
      </div>

      {!data?.season ? (
        <div className="rounded-lg border bg-muted/50 p-8 text-center">
          <p className="text-muted-foreground">
            {t('rankings.page.noSeason')}
          </p>
        </div>
      ) : rankings.length === 0 ? (
        <div className="rounded-lg border bg-muted/50 p-8 text-center">
          <p className="text-muted-foreground">
            {t('rankings.page.empty')}
          </p>
        </div>
      ) : (
        <>
          <RankingsTable rankings={rankings} />

          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                {t('common.previous')}
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum
                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (page <= 3) {
                    pageNum = i + 1
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = page - 2 + i
                  }
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={page === pageNum ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  )
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                {t('common.next')}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
