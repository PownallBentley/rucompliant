import { create } from 'zustand'
import type { CalendarTaskWithDomain } from '@/services/calendarService'

type ViewMode = 'list' | 'month'

interface CalendarState {
  tasks: CalendarTaskWithDomain[]
  viewMode: ViewMode
  selectedMonth: number
  selectedYear: number
  loading: boolean
  setTasks: (tasks: CalendarTaskWithDomain[]) => void
  setViewMode: (mode: ViewMode) => void
  setSelectedMonth: (month: number) => void
  setSelectedYear: (year: number) => void
  setLoading: (loading: boolean) => void
  goToPreviousMonth: () => void
  goToNextMonth: () => void
  goToToday: () => void
}

const now = new Date()

export const useCalendarStore = create<CalendarState>((set) => ({
  tasks: [],
  viewMode: 'list',
  selectedMonth: now.getMonth() + 1,
  selectedYear: now.getFullYear(),
  loading: true,
  setTasks: (tasks) => set({ tasks }),
  setViewMode: (viewMode) => set({ viewMode }),
  setSelectedMonth: (selectedMonth) => set({ selectedMonth }),
  setSelectedYear: (selectedYear) => set({ selectedYear }),
  setLoading: (loading) => set({ loading }),
  goToPreviousMonth: () =>
    set((state) => {
      if (state.selectedMonth === 1) {
        return { selectedMonth: 12, selectedYear: state.selectedYear - 1 }
      }
      return { selectedMonth: state.selectedMonth - 1 }
    }),
  goToNextMonth: () =>
    set((state) => {
      if (state.selectedMonth === 12) {
        return { selectedMonth: 1, selectedYear: state.selectedYear + 1 }
      }
      return { selectedMonth: state.selectedMonth + 1 }
    }),
  goToToday: () =>
    set({
      selectedMonth: new Date().getMonth() + 1,
      selectedYear: new Date().getFullYear(),
    }),
}))
