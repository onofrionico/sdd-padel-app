import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TOURNAMENT_STATUSES, CATEGORIES } from '@/lib/constants'
import { formatTournamentStatus, formatCategory } from '@/lib/utils'
import { useAssociations } from '@/hooks/useAssociations'

interface TournamentFiltersProps {
  status?: string
  category?: number
  associationId?: string
  onStatusChange: (status: string) => void
  onCategoryChange: (category: string) => void
  onAssociationChange: (associationId: string) => void
}

export function TournamentFilters({
  status,
  category,
  associationId,
  onStatusChange,
  onCategoryChange,
  onAssociationChange,
}: TournamentFiltersProps) {
  const { data: associations } = useAssociations()

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="flex-1">
        <Select value={status || 'all'} onValueChange={onStatusChange}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {TOURNAMENT_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {formatTournamentStatus(s)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1">
        <Select value={category?.toString() || 'all'} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c.toString()}>
                {formatCategory(c)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1">
        <Select value={associationId || 'all'} onValueChange={onAssociationChange}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter by association" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Associations</SelectItem>
            {associations?.map((association) => (
              <SelectItem key={association.id} value={association.id}>
                {association.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
