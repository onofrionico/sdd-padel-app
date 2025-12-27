import { useState } from 'react'
import { useTournaments } from '@/hooks/useTournaments'
import { TournamentCard } from '@/components/tournaments/TournamentCard'
import { TournamentFilters } from '@/components/tournaments/TournamentFilters'
import { TournamentSearch } from '@/components/tournaments/TournamentSearch'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export function TournamentsListPage() {
  const [filters, setFilters] = useState({
    status: undefined as string | undefined,
    category: undefined as number | undefined,
    search: undefined as string | undefined,
    page: 1,
    limit: 12,
  })

  const { data, isLoading, error } = useTournaments(filters)

  const handleStatusChange = (status: string) => {
    setFilters((prev) => ({
      ...prev,
      status: status === 'all' ? undefined : status,
      page: 1,
    }))
  }

  const handleCategoryChange = (category: string) => {
    setFilters((prev) => ({
      ...prev,
      category: category === 'all' ? undefined : parseInt(category),
      page: 1,
    }))
  }

  const handleSearch = (search: string) => {
    setFilters((prev) => ({
      ...prev,
      search: search || undefined,
      page: 1,
    }))
  }

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const totalPages = data ? Math.ceil(data.total / filters.limit) : 0

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Tournaments</h1>
        <p className="text-muted-foreground">
          Browse and discover padel tournaments in your area
        </p>
      </div>

      <div className="mb-6 space-y-4">
        <TournamentSearch value={filters.search} onSearch={handleSearch} />
        <TournamentFilters
          status={filters.status}
          category={filters.category}
          onStatusChange={handleStatusChange}
          onCategoryChange={handleCategoryChange}
        />
      </div>

      {isLoading && (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {error && (
        <div className="text-center py-12">
          <p className="text-destructive">Error loading tournaments. Please try again.</p>
        </div>
      )}

      {data && data.tournaments.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No tournaments found.</p>
          <p className="text-muted-foreground text-sm mt-2">
            Try adjusting your filters or search criteria.
          </p>
        </div>
      )}

      {data && data.tournaments.length > 0 && (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.tournaments.map((tournament) => (
              <TournamentCard key={tournament.id} tournament={tournament} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(filters.page - 1)}
                disabled={filters.page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={page === filters.page ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => handlePageChange(page)}
                    className="w-10"
                  >
                    {page}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(filters.page + 1)}
                disabled={filters.page === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
