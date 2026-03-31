import { describe, it, expect } from 'vitest'
import { calculateOverallStatus } from './healthScoreService'
import type { DomainScore } from './healthScoreService'

const makeDomain = (name: string, status: 'green' | 'amber' | 'red'): DomainScore => ({
  id: `id-${name}`,
  domainId: `id-${name}`,
  domainName: name,
  domainDescription: '',
  displayOrder: 1,
  status,
})

describe('calculateOverallStatus', () => {
  it('returns green when all domains are green', () => {
    const scores = [
      makeDomain('Formation', 'green'),
      makeDomain('Tax', 'green'),
      makeDomain('Data', 'green'),
    ]
    expect(calculateOverallStatus(scores)).toBe('green')
  })

  it('returns amber when any domain is amber', () => {
    const scores = [
      makeDomain('Formation', 'green'),
      makeDomain('Tax', 'amber'),
      makeDomain('Data', 'green'),
    ]
    expect(calculateOverallStatus(scores)).toBe('amber')
  })

  it('returns red when any domain is red', () => {
    const scores = [
      makeDomain('Formation', 'green'),
      makeDomain('Tax', 'amber'),
      makeDomain('Data', 'red'),
    ]
    expect(calculateOverallStatus(scores)).toBe('red')
  })

  it('returns red even if only one domain is red among greens', () => {
    const scores = [
      makeDomain('Formation', 'green'),
      makeDomain('Tax', 'green'),
      makeDomain('Data', 'green'),
      makeDomain('H&S', 'green'),
      makeDomain('Employment', 'red'),
      makeDomain('Insurance', 'green'),
    ]
    expect(calculateOverallStatus(scores)).toBe('red')
  })

  it('returns green for empty array', () => {
    expect(calculateOverallStatus([])).toBe('green')
  })
})
