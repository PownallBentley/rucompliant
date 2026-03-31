import { useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'
import { useProfileStore } from '@/stores/profileStore'
import { checkOnboardingCompleted } from '@/services/authService'
import { fetchProfile } from '@/services/accountService'

async function loadUserData(userId: string) {
  const completed = await checkOnboardingCompleted(userId)
  useAuthStore.getState().setOnboardingCompleted(completed)

  const profile = await fetchProfile(userId)
  if (profile) {
    useProfileStore.getState().setAvatarUrl(profile.avatar_url)
    useProfileStore.getState().setName(profile.first_name, profile.last_name)
  }
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (!isSupabaseConfigured) {
      useAuthStore.getState().setLoading(false)
      return
    }

    const { setUser, setSession, setLoading } = useAuthStore.getState()

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user) {
        await loadUserData(session.user.id)
      }

      setLoading(false)
    }).catch(() => {
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        useAuthStore.getState().setSession(session)
        useAuthStore.getState().setUser(session?.user ?? null)

        if (session?.user) {
          await loadUserData(session.user.id)
        } else {
          useAuthStore.getState().setOnboardingCompleted(false)
          useProfileStore.getState().setAvatarUrl(null)
          useProfileStore.getState().setName(null, null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  return <>{children}</>
}
