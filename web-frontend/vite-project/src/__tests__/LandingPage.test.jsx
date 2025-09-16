import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import LandingPage from '../pages/LandingPage'

test('renders landing page header', () => {
  render(
    <MemoryRouter>
      <LandingPage darkMode={false} />
    </MemoryRouter>
  )
  expect(screen.getByRole('heading', { name: /titanic survivor/i })).toBeInTheDocument()
})
