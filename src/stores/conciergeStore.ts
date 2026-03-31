import { create } from 'zustand'
import type { ConciergeStage, ConciergeTaskData } from '@/services/conciergeService'

interface ConciergeState {
  stages: ConciergeStage[]
  currentStageIndex: number
  tasksByStage: Record<string, ConciergeTaskData[]>
  loading: boolean
  setStages: (stages: ConciergeStage[]) => void
  setCurrentStageIndex: (index: number) => void
  setTasksForStage: (stageId: string, tasks: ConciergeTaskData[]) => void
  markTaskCompleted: (stageId: string, taskId: string) => void
  setLoading: (loading: boolean) => void
}

export const useConciergeStore = create<ConciergeState>((set) => ({
  stages: [],
  currentStageIndex: 0,
  tasksByStage: {},
  loading: true,
  setStages: (stages) => set({ stages }),
  setCurrentStageIndex: (index) => set({ currentStageIndex: index }),
  setTasksForStage: (stageId, tasks) =>
    set((state) => ({
      tasksByStage: { ...state.tasksByStage, [stageId]: tasks },
    })),
  markTaskCompleted: (stageId, taskId) =>
    set((state) => ({
      tasksByStage: {
        ...state.tasksByStage,
        [stageId]: (state.tasksByStage[stageId] ?? []).map((t) =>
          t.id === taskId
            ? { ...t, completed: true, completedAt: new Date().toISOString() }
            : t
        ),
      },
    })),
  setLoading: (loading) => set({ loading }),
}))
