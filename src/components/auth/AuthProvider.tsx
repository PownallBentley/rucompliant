import { useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'
import { checkOnboardingCompleted } from '@/services/authService'

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setSession, setLoading, setOnboardingCompleted } = useAuthStore()

  useEffect(() => {
    // Skip auth initialisation if Supabase isn't configured (e.g. CI, preview)
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user) {
        checkOnboardingCompleted(session.user.id).then(setOnboardingCompleted)
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

        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [setUser, setSession, setLoading, setOnboardingCompleted])

  return <>{children}</>
}
