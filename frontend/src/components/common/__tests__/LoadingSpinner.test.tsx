import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/test-utils'
import { LoadingSpinner } from '../LoadingSpinner'

describe('LoadingSpinner', () => {
  it('should render with default size', () => {
    render(<LoadingSpinner />)
    const spinner = screen.getByRole('status')
    expect(spinner).toBeInTheDocument()
  })

  it('should render with small size', () => {
    render(<LoadingSpinner size="sm" />)
    const spinner = screen.getByRole('status')
    expect(spinner).toHaveClass('h-4')
  })

  it('should render with large size', () => {
    render(<LoadingSpinner size="lg" />)
    const spinner = screen.getByRole('status')
    expect(spinner).toHaveClass('h-12')
  })

  it('should have accessible label', () => {
    render(<LoadingSpinner />)
    expect(screen.getByLabelText('Loading')).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    render(<LoadingSpinner className="custom-class" />)
    const spinner = screen.getByRole('status')
    expect(spinner).toHaveClass('custom-class')
  })
})
