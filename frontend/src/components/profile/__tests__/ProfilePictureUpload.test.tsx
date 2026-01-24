import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProfilePictureUpload } from '../ProfilePictureUpload'

describe('ProfilePictureUpload', () => {
  const mockOnUpload = vi.fn()

  beforeEach(() => {
    mockOnUpload.mockClear()
  })

  it('renders with default state', () => {
    render(<ProfilePictureUpload onUpload={mockOnUpload} />)

    expect(screen.getByText('Profile Picture')).toBeInTheDocument()
    expect(screen.getByText(/JPG, PNG or WEBP/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Choose File/i })).toBeInTheDocument()
  })

  it('displays current profile picture when provided', () => {
    const pictureUrl = 'https://example.com/profile.jpg'
    render(<ProfilePictureUpload currentPictureUrl={pictureUrl} onUpload={mockOnUpload} />)

    const img = screen.getByAltText('Profile')
    expect(img).toHaveAttribute('src', pictureUrl)
  })

  it('shows loading state when uploading', () => {
    render(<ProfilePictureUpload onUpload={mockOnUpload} isUploading={true} />)

    expect(screen.getByText('Uploading...')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Uploading/i })).toBeDisabled()
  })

  it('handles file selection', async () => {
    const user = userEvent.setup()
    mockOnUpload.mockResolvedValue({})

    render(<ProfilePictureUpload onUpload={mockOnUpload} />)

    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
    const input = screen.getByRole('button', { name: /Choose File/i })
    
    await user.click(input)

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    if (fileInput) {
      await user.upload(fileInput, file)
    }

    await waitFor(() => {
      expect(mockOnUpload).toHaveBeenCalledWith(file)
    })
  })

  it('shows error for invalid file type', async () => {
    const user = userEvent.setup()
    render(<ProfilePictureUpload onUpload={mockOnUpload} />)

    const file = new File(['test'], 'test.txt', { type: 'text/plain' })
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    
    if (fileInput) {
      await user.upload(fileInput, file)
    }

    await waitFor(() => {
      expect(screen.getByText(/Only.*files are allowed/i)).toBeInTheDocument()
    })
  })

  it('shows error for oversized file', async () => {
    const user = userEvent.setup()
    render(<ProfilePictureUpload onUpload={mockOnUpload} />)

    const largeFile = new File([new ArrayBuffer(6 * 1024 * 1024)], 'large.jpg', {
      type: 'image/jpeg',
    })
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    
    if (fileInput) {
      await user.upload(fileInput, largeFile)
    }

    await waitFor(() => {
      expect(screen.getByText(/File size must be less than/i)).toBeInTheDocument()
    })
  })

  it('handles upload error', async () => {
    const user = userEvent.setup()
    const errorMessage = 'Upload failed'
    mockOnUpload.mockRejectedValue(new Error(errorMessage))

    render(<ProfilePictureUpload onUpload={mockOnUpload} />)

    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    
    if (fileInput) {
      await user.upload(fileInput, file)
    }

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument()
    })
  })
})
