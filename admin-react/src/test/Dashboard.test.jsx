import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Dashboard from '../components/Dashboard/Dashboard'
import { authService } from '../services/api'

// Mock del servicio de autenticación
vi.mock('../services/api', () => ({
  authService: {
    login: vi.fn(),
    getCurrentUser: vi.fn()
  }
}))

const DashboardWrapper = () => (
  <BrowserRouter>
    <Dashboard />
  </BrowserRouter>
)

describe('Dashboard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders dashboard correctly', () => {
    render(<DashboardWrapper />)
    expect(screen.getByText('Level-Up Gamer')).toBeInTheDocument()
  })

  it('shows login form when not authenticated', () => {
    render(<DashboardWrapper />)
    expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument()
  })

  it('handles login form submission', async () => {
    const mockLogin = authService.login.mockResolvedValue({
      token: 'fake-token',
      user: { id: 1, email: 'test@test.com' }
    })

    render(<DashboardWrapper />)
    
    const emailInput = screen.getByPlaceholderText('Correo electrónico')
    const passwordInput = screen.getByPlaceholderText('Contraseña')
    const loginButton = screen.getByText('Iniciar Sesión')

    fireEvent.change(emailInput, { target: { value: 'test@test.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(loginButton)

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        correo: 'test@test.com',
        password: 'password123'
      })
    })
  })

  it('displays error message on failed login', async () => {
    authService.login.mockRejectedValue(new Error('Invalid credentials'))

    render(<DashboardWrapper />)
    
    const emailInput = screen.getByPlaceholderText('Correo electrónico')
    const passwordInput = screen.getByPlaceholderText('Contraseña')
    const loginButton = screen.getByText('Iniciar Sesión')

    fireEvent.change(emailInput, { target: { value: 'wrong@test.com' } })
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } })
    fireEvent.click(loginButton)

    await waitFor(() => {
      expect(screen.getByText('Error de autenticación')).toBeInTheDocument()
    })
  })
})