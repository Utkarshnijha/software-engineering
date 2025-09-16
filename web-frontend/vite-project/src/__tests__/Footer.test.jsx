import { render, screen } from '@testing-library/react'
import Footer from '../components/Footer'

test('renders footer content', () => {
  render(<Footer darkMode={false} />)
  expect(screen.getByText(/2025/i)).toBeInTheDocument()
})
