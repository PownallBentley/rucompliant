import { create } from 'zustand'
import type { HealthStatus } from '@/types'
import type { DomainScore, NextAction } from '@/services/healthScoreService'

interface HealthScoreState {
  overallStatus: HealthStatus | null
  previousStatus: HealthStatus | null
  calculatedAt: string | null
  domainScores: DomainScore[]
  nextActions: NextAction[]
  loading: boolean
  setOverallStatus: (status: HealthStatus, previous: HealthStatus | null, calculatedAt: string) => void
  setDomainScores: (scores: DomainScore[]) => void
  setNextActions: (actions: NextAction[]) => void
  setLoading: (loading: boolean) => void
}

export const useHealthScoreStore = create<HealthScoreState>((set) => ({
  overallStatus: null,
  previousStatus: null,
  calculatedAt: null,
  domainScores: [],
  nextActions: [],
  loading: true,
  setOverallStatus: (status, previous, calculatedAt) =>
    set({ overallStatus: status, previousStatus: previous, calculatedAt }),
  setDomainScores: (scores) => set({ domainScores: scores }),
  setNextActions: (actions) => set({ nextActions: actions }),
  setLoading: (loading) => set({ loading }),
}))
