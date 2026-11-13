import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AssociationCard } from '@/components/associations/AssociationCard'
import { Association } from '@/types/association'

const mockAssociation: Association = {
  id: '1',
  name: 'Test Association',
  description: 'This is a test association for padel tournaments',
  logoUrl: 'https://example.com/logo.png',
  website: 'https://example.com',
  isActive: true,
  pointsByRound: { '1': 10, '2': 20, '3': 30 },
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
}

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

describe('AssociationCard', () => {
  it('renders association name and description', () => {
    renderWithRouter(<AssociationCard association={mockAssociation} />)

    expect(screen.getByText('Test Association')).toBeDefined()
    expect(screen.getByText('This is a test association for padel tournaments')).toBeDefined()
  })

  it('displays active status badge', () => {
    renderWithRouter(<AssociationCard association={mockAssociation} />)

    expect(screen.getByText('Active')).toBeDefined()
  })

  it('displays inactive status badge when association is not active', () => {
    const inactiveAssociation = { ...mockAssociation, isActive: false }
    renderWithRouter(<AssociationCard association={inactiveAssociation} />)

    expect(screen.getByText('Inactive')).toBeDefined()
  })

  it('renders logo image when logoUrl is provided', () => {
    renderWithRouter(<AssociationCard association={mockAssociation} />)

    const logo = screen.getByAltText('Test Association logo')
    expect(logo).toBeDefined()
    expect((logo as HTMLImageElement).src).toBe('https://example.com/logo.png')
  })

  it('renders default icon when logoUrl is not provided', () => {
    const associationWithoutLogo = { ...mockAssociation, logoUrl: undefined }
    const { container } = renderWithRouter(<AssociationCard association={associationWithoutLogo} />)

    const defaultIcon = container.querySelector('svg')
    expect(defaultIcon).toBeDefined()
  })

  it('displays website when provided', () => {
    renderWithRouter(<AssociationCard association={mockAssociation} />)

    expect(screen.getByText('https://example.com')).toBeDefined()
  })

  it('shows points system configured message when points are available', () => {
    renderWithRouter(<AssociationCard association={mockAssociation} />)

    expect(screen.getByText('Points system configured')).toBeDefined()
  })

  it('does not show points system message when no points configured', () => {
    const associationWithoutPoints = { ...mockAssociation, pointsByRound: {} }
    renderWithRouter(<AssociationCard association={associationWithoutPoints} />)

    expect(screen.queryByText('Points system configured')).toBeNull()
  })

  it('shows membership status badge when showMembershipStatus is true', () => {
    renderWithRouter(
      <AssociationCard 
        association={mockAssociation} 
        showMembershipStatus={true}
        isMember={true}
      />
    )

    expect(screen.getByText('Member')).toBeDefined()
  })

  it('shows not a member badge when user is not a member', () => {
    renderWithRouter(
      <AssociationCard 
        association={mockAssociation} 
        showMembershipStatus={true}
        isMember={false}
      />
    )

    expect(screen.getByText('Not a member')).toBeDefined()
  })

  it('does not show membership status when showMembershipStatus is false', () => {
    renderWithRouter(
      <AssociationCard 
        association={mockAssociation} 
        showMembershipStatus={false}
      />
    )

    expect(screen.queryByText('Member')).toBeNull()
    expect(screen.queryByText('Not a member')).toBeNull()
  })

  it('renders as a link to association details page', () => {
    const { container } = renderWithRouter(<AssociationCard association={mockAssociation} />)

    const link = container.querySelector('a')
    expect(link).toBeDefined()
    expect(link?.getAttribute('href')).toBe('/associations/1')
  })

  it('applies custom className when provided', () => {
    const { container } = renderWithRouter(
      <AssociationCard association={mockAssociation} className="custom-class" />
    )

    const card = container.querySelector('.custom-class')
    expect(card).toBeDefined()
  })
})
