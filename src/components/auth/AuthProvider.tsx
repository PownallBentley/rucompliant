import { useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'
import { checkOnboardingCompleted } from '@/services/authService'

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setSession, setLoading, setOnboardingCompleted } = useAuthStore()

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }

    // Get initial session — wait for onboarding check before setting loading false
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user) {
        const completed = await checkOnboardingCompleted(session.user.id)
        setOnboardingCompleted(completed)
      }

      setLoading(false)
    }).catch(() => {
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)

        if (session?.user) {
          const completed = await checkOnboardingCompleted(session.user.id)
          setOnboardingCompleted(completed)
        } else {
          setOnboardingCompleted(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [setUser, setSession, setLoading, setOnboardingCompleted])

  return <>{children}</>
}
