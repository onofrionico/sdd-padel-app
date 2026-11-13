import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@/test/test-utils'
import { RankingsTable } from '../RankingsTable'
import { Ranking } from '@/types/ranking'

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({ user: { id: 1 } }),
}))

const mockRankings: Ranking[] = [
  {
    position: 1,
    user: {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
    },
    points: 500,
    tournamentsCount: 10,
  },
  {
    position: 2,
    user: {
      id: '2',
      firstName: 'Jane',
      lastName: 'Smith',
    },
    points: 450,
    tournamentsCount: 9,
  },
]

describe('RankingsTable', () => {
  it('should render rankings table', () => {
    render(<RankingsTable rankings={mockRankings} />)
    
    expect(screen.getAllByText(/John Doe/).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Jane Smith/).length).toBeGreaterThan(0)
  })

  it('should display position badges correctly', () => {
    render(<RankingsTable rankings={mockRankings} />)
    
    const firstPlaces = screen.getAllByText(/1st/i)
    const secondPlaces = screen.getAllByText(/2nd/i)
    
    expect(firstPlaces.length).toBeGreaterThan(0)
    expect(secondPlaces.length).toBeGreaterThan(0)
  })

  it('should highlight current user', () => {
    render(<RankingsTable rankings={mockRankings} />)
    
    expect(screen.getAllByText('You')).toHaveLength(2) // Desktop and mobile views
  })

  it('should display player statistics', () => {
    render(<RankingsTable rankings={mockRankings} />)
    
    const points = screen.getAllByText('500')
    const tournaments = screen.getAllByText('10')
    
    expect(points.length).toBeGreaterThan(0)
    expect(tournaments.length).toBeGreaterThan(0)
  })

})
