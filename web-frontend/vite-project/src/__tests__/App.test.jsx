import { render, screen } from '@testing-library/react'
import App from '../App'

test('renders the landing page heading', () => {
  render(<App />)
  expect(screen.getByRole('heading', { name: /titanic survivor ai/i })).toBeInTheDocument()
})
