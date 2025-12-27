import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TournamentForm } from '@/components/organizer/TournamentForm'

describe('TournamentForm', () => {
  const mockOnSubmit = vi.fn()

  it('renders tournament form with all required fields', () => {
    render(<TournamentForm onSubmit={mockOnSubmit} />)

    expect(screen.getByLabelText(/tournament name/i)).toBeDefined()
    expect(screen.getByLabelText(/start date/i)).toBeDefined()
    expect(screen.getByLabelText(/tournament type/i)).toBeDefined()
    expect(screen.getByLabelText(/association id/i)).toBeDefined()
  })

  it('displays validation errors for invalid inputs', async () => {
    const user = userEvent.setup()
    render(<TournamentForm onSubmit={mockOnSubmit} />)

    const submitButton = screen.getByRole('button', { name: /create tournament/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/tournament name must be at least 3 characters/i)).toBeDefined()
    })
  })

  it('calls onSubmit with correct data when form is valid', async () => {
    const user = userEvent.setup()
    mockOnSubmit.mockResolvedValueOnce(undefined)

    const { container } = render(<TournamentForm onSubmit={mockOnSubmit} />)

    const nameInput = screen.getByLabelText(/tournament name/i)
    const startDateInput = screen.getByLabelText(/start date/i)
    const typeSelect = screen.getByLabelText(/tournament type/i)
    const associationIdInput = screen.getByLabelText(/association id/i)

    await user.clear(nameInput)
    await user.type(nameInput, 'Summer Championship')
    await user.type(startDateInput, '2024-07-01')
    await user.selectOptions(typeSelect, 'single_elimination')
    await user.clear(associationIdInput)
    await user.type(associationIdInput, '123e4567-e89b-12d3-a456-426614174000')

    const submitButton = screen.getByRole('button', { name: /create tournament/i })
    await user.click(submitButton)

    await waitFor(
      () => {
        expect(mockOnSubmit).toHaveBeenCalledTimes(1)
      },
      { timeout: 5000 }
    )

    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Summer Championship',
        startDate: '2024-07-01',
        type: 'single_elimination',
        associationId: '123e4567-e89b-12d3-a456-426614174000',
      })
    )
  })

  it('shows loading state when submitting', async () => {
    render(<TournamentForm onSubmit={mockOnSubmit} isLoading={true} />)

    expect(screen.getByText(/saving/i)).toBeDefined()
  })

  it('populates form with tournament data when editing', () => {
    const tournament = {
      id: 1,
      name: 'Existing Tournament',
      associationId: 1,
      startDate: '2024-07-01',
      endDate: '2024-07-03',
      registrationDeadline: '2024-06-25',
      location: 'Test Location',
      format: 'single_elimination' as const,
      maxTeams: 32,
      categories: [1, 2, 3],
      status: 'upcoming' as const,
      pointDistribution: { '1': 100, '2': 70 },
      showCapacity: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    }

    render(<TournamentForm tournament={tournament} onSubmit={mockOnSubmit} />)

    expect((screen.getByLabelText(/tournament name/i) as HTMLInputElement).value).toBe('Existing Tournament')
  })
})
