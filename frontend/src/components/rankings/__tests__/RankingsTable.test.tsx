import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@/test/test-utils'
import { RankingsTable } from '../RankingsTable'
import { Ranking } from '@/types/ranking'

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({ user: { id: 1 } }),
}))

const mockRankings: Ranking[] = [
  {
    id: 1,
    playerId: 1,
    playerName: 'John Doe',
    categoryId: 3,
    points: 500,
    position: 1,
    matchesPlayed: 50,
    matchesWon: 35,
    matchesLost: 15,
    tournamentsPlayed: 10,
    updatedAt: '2024-01-01',
  },
  {
    id: 2,
    playerId: 2,
    playerName: 'Jane Smith',
    categoryId: 3,
    points: 450,
    position: 2,
    matchesPlayed: 45,
    matchesWon: 30,
    matchesLost: 15,
    tournamentsPlayed: 9,
    updatedAt: '2024-01-01',
  },
]

describe('RankingsTable', () => {
  it('should render rankings table', () => {
    render(<RankingsTable rankings={mockRankings} />)
    
    const johnDoe = screen.getAllByText('John Doe')
    const janeSmith = screen.getAllByText('Jane Smith')
    
    expect(johnDoe.length).toBeGreaterThan(0)
    expect(janeSmith.length).toBeGreaterThan(0)
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
    const wins = screen.getAllByText('35')
    
    expect(points.length).toBeGreaterThan(0)
    expect(wins.length).toBeGreaterThan(0)
  })

  it('should calculate win rate correctly', () => {
    render(<RankingsTable rankings={mockRankings} />)
    
    const winRates = screen.getAllByText(/70.0%/)
    expect(winRates.length).toBeGreaterThan(0)
  })
})
