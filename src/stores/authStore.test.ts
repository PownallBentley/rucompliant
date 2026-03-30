import { describe, it, expect, beforeEach } from 'vitest'
import { useAuthStore } from './authStore'

describe('authStore', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      session: null,
      loading: true,
      onboardingCompleted: null,
    })
  })

  it('initialises with null user and loading true', () => {
    const state = useAuthStore.getState()
    expect(state.user).toBeNull()
    expect(state.session).toBeNull()
    expect(state.loading).toBe(true)
    expect(state.onboardingCompleted).toBeNull()
  })

  it('sets loading state', () => {
    useAuthStore.getState().setLoading(false)
    expect(useAuthStore.getState().loading).toBe(false)
  })

  it('sets user', () => {
    const mockUser = { id: '123', email: 'sarah@example.com' } as never
    useAuthStore.getState().setUser(mockUser)
    expect(useAuthStore.getState().user).toEqual(mockUser)
  })

  it('clears user on logout', () => {
    const mockUser = { id: '123', email: 'sarah@example.com' } as never
    useAuthStore.getState().setUser(mockUser)
    useAuthStore.getState().setUser(null)
    expect(useAuthStore.getState().user).toBeNull()
  })

  it('isAuthenticated returns true when user is set', () => {
    const mockUser = { id: '123', email: 'sarah@example.com' } as never
    useAuthStore.getState().setUser(mockUser)
    expect(useAuthStore.getState().isAuthenticated()).toBe(true)
  })

  it('isAuthenticated returns false when no user', () => {
    expect(useAuthStore.getState().isAuthenticated()).toBe(false)
  })

  it('sets onboarding completed', () => {
    useAuthStore.getState().setOnboardingCompleted(true)
    expect(useAuthStore.getState().onboardingCompleted).toBe(true)
  })

  it('sets onboarding to false', () => {
    useAuthStore.getState().setOnboardingCompleted(false)
    expect(useAuthStore.getState().onboardingCompleted).toBe(false)
  })
})
