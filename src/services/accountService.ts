import { supabase } from '@/lib/supabase'
import type { BusinessProfile } from '@/types'

export async function fetchProfile(userId: string): Promise<BusinessProfile | null> {
  const { data } = await supabase
    .from('business_profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()

  return data
}

export async function updateProfile(userId: string, updates: Partial<BusinessProfile>) {
  const { error } = await supabase
    .from('business_profiles')
    .update(updates)
    .eq('user_id', userId)

  if (error) throw error
}

export async function uploadAvatar(userId: string, file: File): Promise<string> {
  const ext = file.name.split('.').pop()
  const path = `${userId}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(path, file, { upsert: true })

  if (uploadError) throw uploadError

  const { data } = supabase.storage
    .from('avatars')
    .getPublicUrl(path)

  // Save URL to profile
  await updateProfile(userId, { avatar_url: data.publicUrl } as Partial<BusinessProfile>)

  return data.publicUrl
}
