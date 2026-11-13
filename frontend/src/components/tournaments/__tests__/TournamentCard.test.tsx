import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/test-utils'
import { TournamentCard } from '../TournamentCard'
import { Tournament } from '@/types/tournament'

const mockTournament: Tournament = {
  id: '1',
  name: 'Summer Championship 2024',
  description: 'Torneo de verano en Buenos Aires',
  associationId: '1',
  startDate: '2024-07-01',
  endDate: '2024-07-03',
  type: 'single_elimination',
  status: 'upcoming',
  settings: {
    maxTeams: 16,
    teamSize: 2,
    categoryRange: { min: 1, max: 3 },
    pointsDistribution: { '1st': 100, '2nd': 75, '3rd': 50 },
  },
  isPublic: true,
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
}

describe('TournamentCard', () => {
  it('should render tournament name', () => {
    render(<TournamentCard tournament={mockTournament} />)
    expect(screen.getByText('Summer Championship 2024')).toBeInTheDocument()
  })

  it('should render tournament description', () => {
    render(<TournamentCard tournament={mockTournament} />)
    expect(screen.getByText('Torneo de verano en Buenos Aires')).toBeInTheDocument()
  })

  it('should render tournament status badge', () => {
    render(<TournamentCard tournament={mockTournament} />)
    expect(screen.getByText('Upcoming')).toBeInTheDocument()
  })

  it('should render categories from the category range', () => {
    render(<TournamentCard tournament={mockTournament} />)
    expect(screen.getByText('1st Category')).toBeInTheDocument()
    expect(screen.getByText('2nd Category')).toBeInTheDocument()
    expect(screen.getByText('3rd Category')).toBeInTheDocument()
  })

  it('should render capacity when maxTeams is set', () => {
    render(<TournamentCard tournament={mockTournament} />)
    expect(screen.getByText(/Capacity: 16 teams/i)).toBeInTheDocument()
  })

  it('should not render capacity when maxTeams is not set', () => {
    const tournament = { ...mockTournament, settings: { ...mockTournament.settings, maxTeams: undefined } }
    render(<TournamentCard tournament={tournament} />)
    expect(screen.queryByText(/Capacity:/i)).not.toBeInTheDocument()
  })

  it('should render tournament format', () => {
    render(<TournamentCard tournament={mockTournament} />)
    expect(screen.getByText(/single elimination/i)).toBeInTheDocument()
  })

  it('should have link to tournament details', () => {
    render(<TournamentCard tournament={mockTournament} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/tournaments/1')
  })
})
