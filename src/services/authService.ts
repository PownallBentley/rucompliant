import { supabase } from '@/lib/supabase'

/**
 * TEMPORARY: Email + password auth for development.
 * Will be replaced with Google/Microsoft OAuth + Email OTP for production.
 */

export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) throw error
  return data
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return data
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
