import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { LoginForm } from '../LoginForm'
import { AuthProvider } from '@/contexts/AuthContext'

const mockNavigate = vi.fn()
const mockLogin = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ state: null }),
  }
})

vi.mock('@/contexts/AuthContext', async () => {
  const actual = await vi.importActual('@/contexts/AuthContext')
  return {
    ...actual,
    useAuth: () => ({
      login: mockLogin,
      isAuthenticated: false,
      isLoading: false,
    }),
  }
})

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders login form with email and password fields', () => {
    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    )

    expect(screen.getByLabelText(/email/i)).toBeDefined()
    expect(screen.getByLabelText(/password/i)).toBeDefined()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeDefined()
  })

  it('displays validation errors for invalid inputs', async () => {
    const user = userEvent.setup()
    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    )

    const submitButton = screen.getByRole('button', { name: /sign in/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/invalid email address/i)).toBeDefined()
    })
  })

  it('calls login function with correct credentials on submit', async () => {
    const user = userEvent.setup()
    mockLogin.mockResolvedValueOnce(undefined)

    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    )

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /sign in/i })

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123')
    })
  })

  it('displays error message on login failure', async () => {
    const user = userEvent.setup()
    mockLogin.mockRejectedValueOnce({
      response: { data: { message: 'Invalid credentials' } },
    })

    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    )

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /sign in/i })

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'wrongpassword')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeDefined()
    })
  })

  it('navigates to register page when sign up link is clicked', async () => {
    const user = userEvent.setup()
    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    )

    const signUpLink = screen.getByRole('button', { name: /sign up/i })
    await user.click(signUpLink)

    expect(mockNavigate).toHaveBeenCalledWith('/register')
  })
})
