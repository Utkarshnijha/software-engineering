import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import NavBar from '../components/NavBar'

test('renders navigation links', () => {
  render(
    <MemoryRouter>
      <NavBar darkMode={false} setDarkMode={() => {}} isAuthenticated={false} setIsAuthenticated={() => {}} />
    </MemoryRouter>
  )
  expect(screen.getByText(/home/i)).toBeInTheDocument()
})
