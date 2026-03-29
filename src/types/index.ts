// Shared type definitions for RUCompliant
// Add types here as features are built

export type HealthStatus = 'green' | 'amber' | 'red'

export interface BusinessProfile {
  id: string
  userId: string
  businessType: 'sole_trader' | 'limited_company' | 'partnership'
  headcount: number
  vatRegistered: boolean | null
  sector: string
  tradingStartDate: string | null
  createdAt: string
  updatedAt: string
}
