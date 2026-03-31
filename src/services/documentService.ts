import { supabase } from '@/lib/supabase'
import type { Document, DocumentCategory } from '@/types'

const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png']
const MAX_FILE_SIZE = 25 * 1024 * 1024 // 25 MB

export const CATEGORY_LABELS: Record<DocumentCategory, string> = {
  formation: 'Formation',
  contracts: 'Contracts',
  policies: 'Policies',
  insurance: 'Insurance',
  tax_accounts: 'Tax & Accounts',
  health_safety: 'Health & Safety',
  training: 'Training',
}

export const ALL_CATEGORIES: DocumentCategory[] = [
  'formation',
  'contracts',
  'policies',
  'insurance',
  'tax_accounts',
  'health_safety',
  'training',
]

/**
 * Validate file before upload.
 * Returns an error message string or null if valid.
 */
export function validateFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Only PDF, JPG and PNG files are allowed.'
  }
  if (file.size > MAX_FILE_SIZE) {
    return 'File size must be under 25 MB.'
  }
  return null
}

/**
 * Fetch documents for a user, optionally filtered by category.
 * Results are sorted newest-first.
 */
export async function fetchDocuments(
  userId: string,
  category?: DocumentCategory
): Promise<Document[]> {
  let query = supabase
    .from('documents')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (category) {
    query = query.eq('category', category)
  }

  const { data, error } = await query

  if (error) throw new Error(`Failed to fetch documents: ${error.message}`)
  return data ?? []
}

/**
 * Upload a document to Supabase Storage and save metadata to the documents table.
 */
export async function uploadDocument(
  userId: string,
  file: File,
  category: DocumentCategory,
  expiryDate?: string
): Promise<Document> {
  const validationError = validateFile(file)
  if (validationError) throw new Error(validationError)

  // Build a unique storage path to avoid collisions
  const timestamp = Date.now()
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const filePath = `${userId}/${timestamp}_${safeName}`

  // Upload to Storage
  const { error: uploadError } = await supabase.storage
    .from('documents')
    .upload(filePath, file, { upsert: false })

  if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`)

  // Save metadata
  const { data, error: insertError } = await supabase
    .from('documents')
    .insert({
      user_id: userId,
      file_name: file.name,
      file_path: filePath,
      file_type: file.type,
      file_size: file.size,
      category,
      expiry_date: expiryDate || null,
    })
    .select()
    .single()

  if (insertError) {
    // Rollback: remove the uploaded file if the DB insert fails
    await supabase.storage.from('documents').remove([filePath])
    throw new Error(`Failed to save document metadata: ${insertError.message}`)
  }

  return data
}

/**
 * Delete a document — removes both the storage object and the database row.
 */
export async function deleteDocument(
  userId: string,
  documentId: string,
  filePath: string
): Promise<void> {
  // Delete from storage first
  const { error: storageError } = await supabase.storage
    .from('documents')
    .remove([filePath])

  if (storageError) {
    throw new Error(`Failed to delete file: ${storageError.message}`)
  }

  // Delete from database
  const { error: dbError } = await supabase
    .from('documents')
    .delete()
    .eq('id', documentId)
    .eq('user_id', userId)

  if (dbError) {
    throw new Error(`Failed to delete document record: ${dbError.message}`)
  }
}

/**
 * Get a temporary download URL for a document.
 */
export async function getDownloadUrl(filePath: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from('documents')
    .createSignedUrl(filePath, 60) // 60 seconds

  if (error || !data?.signedUrl) {
    throw new Error('Failed to generate download link.')
  }

  return data.signedUrl
}
