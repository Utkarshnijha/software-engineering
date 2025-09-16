import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ProtectedRoute from '../components/ProtectedRoute'

test('renders children when authenticated', () => {
  render(
    <MemoryRouter>
      <ProtectedRoute isAuthenticated={true}>
        <div>Secret Content</div>
      </ProtectedRoute>
    </MemoryRouter>
  )
  expect(screen.getByText(/secret content/i)).toBeInTheDocument()
})
