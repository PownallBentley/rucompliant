import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders the landing page headline', () => {
    render(<App />)
    expect(screen.getByText('Compliance That Has Your Back')).toBeInTheDocument()
  })

  it('renders the get started CTA', () => {
    render(<App />)
    expect(screen.getByText('Get Started')).toBeInTheDocument()
  })
})
