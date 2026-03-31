import { supabase } from '@/lib/supabase'

const APP_URL = import.meta.env.VITE_APP_URL || 'http://localhost:5173'

export async function signInWithMagicLink(email: string) {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${APP_URL}/auth/callback`,
    },
  })

  if (error) throw error
  return { success: true }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession()
  if (error) throw error
  return session
}

export async function checkOnboardingCompleted(userId: string): Promise<boolean> {
  const { data } = await supabase
    .from('business_profiles')
    .select('onboarding_completed')
    .eq('user_id', userId)
    .maybeSingle()

  return data?.onboarding_completed ?? false
}

export function onAuthStateChange(callback: (event: string, session: unknown) => void) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(callback)
  return subscription
}
