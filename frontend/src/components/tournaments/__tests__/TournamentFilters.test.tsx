import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@/test/test-utils'
import { TournamentFilters } from '../TournamentFilters'

describe('TournamentFilters', () => {
  it('should render status filter', () => {
    const onStatusChange = vi.fn()
    const onCategoryChange = vi.fn()
    const onAssociationChange = vi.fn()
    
    render(
      <TournamentFilters
        onStatusChange={onStatusChange}
        onCategoryChange={onCategoryChange}
        onAssociationChange={onAssociationChange}
      />
    )
    
    expect(screen.getByText('All Statuses')).toBeInTheDocument()
  })

  it('should render category filter', () => {
    const onStatusChange = vi.fn()
    const onCategoryChange = vi.fn()
    const onAssociationChange = vi.fn()
    
    render(
      <TournamentFilters
        onStatusChange={onStatusChange}
        onCategoryChange={onCategoryChange}
        onAssociationChange={onAssociationChange}
      />
    )
    
    expect(screen.getByText('All Categories')).toBeInTheDocument()
  })

  it('should have status, category and association filters', () => {
    const onStatusChange = vi.fn()
    const onCategoryChange = vi.fn()
    const onAssociationChange = vi.fn()
    
    render(
      <TournamentFilters
        onStatusChange={onStatusChange}
        onCategoryChange={onCategoryChange}
        onAssociationChange={onAssociationChange}
      />
    )
    
    const comboboxes = screen.getAllByRole('combobox')
    expect(comboboxes).toHaveLength(3)
  })

  it('should display selected status', () => {
    const onStatusChange = vi.fn()
    const onCategoryChange = vi.fn()
    const onAssociationChange = vi.fn()
    
    render(
      <TournamentFilters
        status="upcoming"
        onStatusChange={onStatusChange}
        onCategoryChange={onCategoryChange}
        onAssociationChange={onAssociationChange}
      />
    )
    
    expect(screen.getByText('Upcoming')).toBeInTheDocument()
  })

  it('should display selected category', () => {
    const onStatusChange = vi.fn()
    const onCategoryChange = vi.fn()
    const onAssociationChange = vi.fn()
    
    render(
      <TournamentFilters
        category={3}
        onStatusChange={onStatusChange}
        onCategoryChange={onCategoryChange}
        onAssociationChange={onAssociationChange}
      />
    )
    
    expect(screen.getByText('3rd Category')).toBeInTheDocument()
  })
})
