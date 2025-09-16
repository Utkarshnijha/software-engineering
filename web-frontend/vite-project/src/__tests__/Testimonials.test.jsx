import { render, screen } from '@testing-library/react'
import Testimonials from '../components/Testimonials'

test('renders testimonials section', () => {
  render(<Testimonials darkMode={false} />)
  expect(screen.getByText(/what users say/i)).toBeInTheDocument()
})
