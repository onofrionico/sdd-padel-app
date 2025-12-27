import { useState } from 'react'
import { useRankings } from '@/hooks/useRankings'
import { RankingsTable } from '@/components/rankings/RankingsTable'
import { CategoryFilter } from '@/components/rankings/CategoryFilter'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export function RankingsPage() {
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined)
  const [page, setPage] = useState(1)
  const limit = 20

  const { data, isLoading, error } = useRankings({
    categoryId,
    page,
    limit,
  })

  const totalPages = data ? Math.ceil(data.total / limit) : 0

  if (isLoading) {
    return (
      <div className="container py-8">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-8">
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-center">
          <p className="text-destructive">Failed to load rankings. Please try again.</p>
        </div>
      </div>
    )
  }

  const rankings = data?.rankings || []

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Player Rankings</h1>
        <p className="text-muted-foreground">
          View the current rankings and standings across all categories
        </p>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <CategoryFilter value={categoryId} onChange={setCategoryId} />
        
        {data && (
          <div className="text-sm text-muted-foreground">
            Showing {rankings.length} of {data.total} players
          </div>
        )}
      </div>

      {rankings.length === 0 ? (
        <div className="rounded-lg border bg-muted/50 p-8 text-center">
          <p className="text-muted-foreground">
            No rankings available for this category yet.
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
                Previous
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
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
