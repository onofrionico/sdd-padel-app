import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { RegisterForm } from '../RegisterForm'

const mockNavigate = vi.fn()
const mockRegister = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

vi.mock('@/contexts/AuthContext', async () => {
  const actual = await vi.importActual('@/contexts/AuthContext')
  return {
    ...actual,
    useAuth: () => ({
      register: mockRegister,
      isAuthenticated: false,
      isLoading: false,
    }),
  }
})

describe('RegisterForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders registration form with all required fields', () => {
    render(
      <BrowserRouter>
        <RegisterForm />
      </BrowserRouter>
    )

    expect(screen.getByLabelText(/first name/i)).toBeDefined()
    expect(screen.getByLabelText(/last name/i)).toBeDefined()
    expect(screen.getByLabelText(/email/i)).toBeDefined()
    expect(screen.getByLabelText(/^password/i)).toBeDefined()
    expect(screen.getByRole('button', { name: /create account/i })).toBeDefined()
  })

  it('displays validation errors for invalid inputs', async () => {
    const user = userEvent.setup()
    render(
      <BrowserRouter>
        <RegisterForm />
      </BrowserRouter>
    )

    const submitButton = screen.getByRole('button', { name: /create account/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/first name must be at least 2 characters/i)).toBeDefined()
    })
  })

  it('calls register function with correct data on submit', async () => {
    const user = userEvent.setup()
    mockRegister.mockResolvedValueOnce(undefined)

    render(
      <BrowserRouter>
        <RegisterForm />
      </BrowserRouter>
    )

    await user.type(screen.getByLabelText(/first name/i), 'John')
    await user.type(screen.getByLabelText(/last name/i), 'Doe')
    await user.type(screen.getByLabelText(/email/i), 'john@example.com')
    await user.type(screen.getByLabelText(/^password/i), 'password123')
    
    const submitButton = screen.getByRole('button', { name: /create account/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith(
        expect.objectContaining({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          password: 'password123',
        })
      )
    })
  })

  it('navigates to profile setup page on successful registration', async () => {
    const user = userEvent.setup()
    mockRegister.mockResolvedValueOnce(undefined)

    render(
      <BrowserRouter>
        <RegisterForm />
      </BrowserRouter>
    )

    await user.type(screen.getByLabelText(/first name/i), 'John')
    await user.type(screen.getByLabelText(/last name/i), 'Doe')
    await user.type(screen.getByLabelText(/email/i), 'john@example.com')
    await user.type(screen.getByLabelText(/^password/i), 'password123')
    
    const submitButton = screen.getByRole('button', { name: /create account/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/profile-setup', { replace: true })
    })
  })

  it('displays error message on registration failure', async () => {
    const user = userEvent.setup()
    mockRegister.mockRejectedValueOnce({
      response: { data: { message: 'Email already exists' } },
    })

    render(
      <BrowserRouter>
        <RegisterForm />
      </BrowserRouter>
    )

    await user.type(screen.getByLabelText(/first name/i), 'John')
    await user.type(screen.getByLabelText(/last name/i), 'Doe')
    await user.type(screen.getByLabelText(/email/i), 'existing@example.com')
    await user.type(screen.getByLabelText(/^password/i), 'password123')
    
    const submitButton = screen.getByRole('button', { name: /create account/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/email already exists/i)).toBeDefined()
    })
  })
})
