import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Register from '../pages/Register'

test('renders register form', () => {
  render(
    <MemoryRouter>
      <Register darkMode={false} setIsAuthenticated={() => {}} />
    </MemoryRouter>
  )
  expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument()
})
