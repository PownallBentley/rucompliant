import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey)

// Warn but don't crash — allows landing page to render without env vars (e.g. in CI)
if (!isSupabaseConfigured) {
  console.warn('Missing Supabase environment variables. Auth and data features will not work.')
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      // Disable navigator lock to prevent race conditions between
      // AuthProvider's onAuthStateChange and active API requests
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      lock: async (_name: string, _acquireTimeout: number, fn: () => Promise<any>) => {
        return fn()
      },
    },
  }
)
