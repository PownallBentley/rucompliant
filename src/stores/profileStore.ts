import { create } from 'zustand'

interface ProfileState {
  avatarUrl: string | null
  firstName: string | null
  lastName: string | null
  setAvatarUrl: (url: string | null) => void
  setName: (first: string | null, last: string | null) => void
}

export const useProfileStore = create<ProfileState>((set) => ({
  avatarUrl: null,
  firstName: null,
  lastName: null,
  setAvatarUrl: (url) => set({ avatarUrl: url }),
  setName: (first, last) => set({ firstName: first, lastName: last }),
}))
