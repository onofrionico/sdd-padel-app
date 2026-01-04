import { useAssociations } from '@/hooks/useAssociations'
import { AssociationCard } from '@/components/associations/AssociationCard'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { Building2 } from 'lucide-react'

export function AssociationsListPage() {
  const { data: associations, isLoading, error } = useAssociations()

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Associations</h1>
        <p className="text-muted-foreground">
          Browse and join padel associations to participate in tournaments
        </p>
      </div>

      {isLoading && (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {error && (
        <div className="text-center py-12">
          <p className="text-destructive">Error loading associations. Please try again.</p>
        </div>
      )}

      {associations && associations.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground text-lg">No associations found.</p>
          <p className="text-muted-foreground text-sm mt-2">
            Check back later for new associations.
          </p>
        </div>
      )}

      {associations && associations.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {associations.map((association) => (
            <AssociationCard key={association.id} association={association} />
          ))}
        </div>
      )}
    </div>
  )
}
