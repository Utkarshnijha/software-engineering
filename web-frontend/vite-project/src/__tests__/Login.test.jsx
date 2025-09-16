import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Login from '../pages/Login'

test('renders login form', () => {
  render(
    <MemoryRouter>
      <Login darkMode={false} setIsAuthenticated={() => {}} />
    </MemoryRouter>
  )
  expect(screen.getByLabelText(/username/i)).toBeInTheDocument()
})
