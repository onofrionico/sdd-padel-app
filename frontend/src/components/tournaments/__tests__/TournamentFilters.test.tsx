import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@/test/test-utils'
import { TournamentFilters } from '../TournamentFilters'
import userEvent from '@testing-library/user-event'

describe('TournamentFilters', () => {
  it('should render status filter', () => {
    const onStatusChange = vi.fn()
    const onCategoryChange = vi.fn()
    
    render(
      <TournamentFilters
        onStatusChange={onStatusChange}
        onCategoryChange={onCategoryChange}
      />
    )
    
    expect(screen.getByText('All Statuses')).toBeInTheDocument()
  })

  it('should render category filter', () => {
    const onStatusChange = vi.fn()
    const onCategoryChange = vi.fn()
    
    render(
      <TournamentFilters
        onStatusChange={onStatusChange}
        onCategoryChange={onCategoryChange}
      />
    )
    
    expect(screen.getByText('All Categories')).toBeInTheDocument()
  })

  it('should have status and category filters', () => {
    const onStatusChange = vi.fn()
    const onCategoryChange = vi.fn()
    
    render(
      <TournamentFilters
        onStatusChange={onStatusChange}
        onCategoryChange={onCategoryChange}
      />
    )
    
    const comboboxes = screen.getAllByRole('combobox')
    expect(comboboxes).toHaveLength(2)
  })

  it('should display selected status', () => {
    const onStatusChange = vi.fn()
    const onCategoryChange = vi.fn()
    
    render(
      <TournamentFilters
        status="upcoming"
        onStatusChange={onStatusChange}
        onCategoryChange={onCategoryChange}
      />
    )
    
    expect(screen.getByText('Próximo')).toBeInTheDocument()
  })

  it('should display selected category', () => {
    const onStatusChange = vi.fn()
    const onCategoryChange = vi.fn()
    
    render(
      <TournamentFilters
        category={3}
        onStatusChange={onStatusChange}
        onCategoryChange={onCategoryChange}
      />
    )
    
    expect(screen.getByText('3ra Categoría')).toBeInTheDocument()
  })
})
