import { render } from '@testing-library/react'
import Background from '../components/Background'

test('renders background container', () => {
  const { container } = render(<Background />)
  expect(container.querySelector('div')).toBeInTheDocument()
})
