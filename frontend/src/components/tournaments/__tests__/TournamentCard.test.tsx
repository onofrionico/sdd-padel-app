import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/test-utils'
import { TournamentCard } from '../TournamentCard'
import { Tournament } from '@/types/tournament'

const mockTournament: Tournament = {
  id: 1,
  name: 'Summer Championship 2024',
  associationId: 1,
  startDate: '2024-07-01',
  endDate: '2024-07-03',
  registrationDeadline: '2024-06-25',
  location: 'Buenos Aires',
  format: 'single_elimination',
  maxTeams: 16,
  categories: [1, 2, 3],
  status: 'upcoming',
  pointDistribution: { '1st': 100, '2nd': 75, '3rd': 50 },
  showCapacity: true,
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
}

describe('TournamentCard', () => {
  it('should render tournament name', () => {
    render(<TournamentCard tournament={mockTournament} />)
    expect(screen.getByText('Summer Championship 2024')).toBeInTheDocument()
  })

  it('should render tournament location', () => {
    render(<TournamentCard tournament={mockTournament} />)
    expect(screen.getByText('Buenos Aires')).toBeInTheDocument()
  })

  it('should render tournament status badge', () => {
    render(<TournamentCard tournament={mockTournament} />)
    expect(screen.getByText('Próximo')).toBeInTheDocument()
  })

  it('should render categories', () => {
    render(<TournamentCard tournament={mockTournament} />)
    expect(screen.getByText('1ra Categoría')).toBeInTheDocument()
    expect(screen.getByText('2da Categoría')).toBeInTheDocument()
    expect(screen.getByText('3ra Categoría')).toBeInTheDocument()
  })

  it('should render capacity when showCapacity is true', () => {
    render(<TournamentCard tournament={mockTournament} />)
    expect(screen.getByText(/Capacity: 16 teams/i)).toBeInTheDocument()
  })

  it('should not render capacity when showCapacity is false', () => {
    const tournament = { ...mockTournament, showCapacity: false }
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
