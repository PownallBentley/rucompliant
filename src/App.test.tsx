import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders the landing page with brand name', () => {
    render(<App />)
    expect(screen.getByText('RUCompliant')).toBeInTheDocument()
  })

  it('renders the tagline', () => {
    render(<App />)
    expect(screen.getByText('Compliance that has your back')).toBeInTheDocument()
  })
})
