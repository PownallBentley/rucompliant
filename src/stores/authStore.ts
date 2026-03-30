import { create } from 'zustand'
import type { User, Session } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
  onboardingCompleted: boolean | null
  setUser: (user: User | null) => void
  setSession: (session: Session | null) => void
  setLoading: (loading: boolean) => void
  setOnboardingCompleted: (completed: boolean) => void
  isAuthenticated: () => boolean
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  loading: true,
  onboardingCompleted: null,
  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  setLoading: (loading) => set({ loading }),
  setOnboardingCompleted: (completed) => set({ onboardingCompleted: completed }),
  isAuthenticated: () => !!get().user,
}))
