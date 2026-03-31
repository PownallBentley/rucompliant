import { useState } from 'react'
import { Button, Badge, AppIcon, EmptyState } from '@/components/ui'
import { cn } from '@/lib/utils'
import { deleteDocument, getDownloadUrl, CATEGORY_LABELS } from '@/services/documentService'
import type { Document, DocumentCategory } from '@/types'

interface DocumentListProps {
  documents: Document[]
  userId: string
  selectedCategory: DocumentCategory | 'all'
  onDocumentDeleted: (documentId: string) => void
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function getFileIcon(fileType: string): 'file-text' | 'image' {
  if (fileType === 'application/pdf') return 'file-text'
  return 'image'
}

function isExpiringSoon(expiryDate: string | null): boolean {
  if (!expiryDate) return false
  const expiry = new Date(expiryDate)
  const now = new Date()
  const daysUntilExpiry = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  return daysUntilExpiry <= 30 && daysUntilExpiry > 0
}

function isExpired(expiryDate: string | null): boolean {
  if (!expiryDate) return false
  return new Date(expiryDate) < new Date()
}

export default function DocumentList({
  documents,
  userId,
  selectedCategory,
  onDocumentDeleted,
}: DocumentListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)

  const categoryLabel =
    selectedCategory === 'all'
      ? 'any category'
      : CATEGORY_LABELS[selectedCategory]

  if (documents.length === 0) {
    return (
      <EmptyState
        icon="folder"
        title={
          selectedCategory === 'all'
            ? 'No documents yet'
            : `No documents in ${categoryLabel} yet`
        }
        description={
          selectedCategory === 'all'
            ? 'Upload your first document to get started.'
            : `Upload your first ${categoryLabel.toLowerCase()} document.`
        }
      />
    )
  }

  const handleDownload = async (doc: Document) => {
    setDownloadingId(doc.id)
    try {
      const url = await getDownloadUrl(doc.file_path)
      window.open(url, '_blank')
    } catch {
      // Silently fail — user will see nothing happened
    } finally {
      setDownloadingId(null)
    }
  }

  const handleDelete = async (doc: Document) => {
    setDeletingId(doc.id)
    try {
      await deleteDocument(userId, doc.id, doc.file_path)
      onDocumentDeleted(doc.id)
    } catch {
      // Could add toast here in future
    } finally {
      setDeletingId(null)
      setConfirmDeleteId(null)
    }
  }

  return (
    <div className="space-y-2">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className="flex items-center gap-3 p-3 sm:p-4 rounded-xl border border-border bg-card hover:border-primary/30 transition-colors"
        >
          {/* File icon */}
          <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <AppIcon
              name={getFileIcon(doc.file_type)}
              className="w-5 h-5 text-primary"
            />
          </div>

          {/* File info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {doc.file_name}
            </p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
              <span className="text-xs text-muted-foreground">
                {formatDate(doc.created_at)}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatFileSize(doc.file_size)}
              </span>
              {selectedCategory === 'all' && (
                <Badge size="sm" variant="default">
                  {CATEGORY_LABELS[doc.category as DocumentCategory]}
                </Badge>
              )}
              {doc.expiry_date && (
                <span
                  className={cn(
                    'text-xs',
                    isExpired(doc.expiry_date)
                      ? 'text-destructive font-medium'
                      : isExpiringSoon(doc.expiry_date)
                        ? 'text-warning font-medium'
                        : 'text-muted-foreground'
                  )}
                >
                  {isExpired(doc.expiry_date) ? 'Expired' : 'Expires'}{' '}
                  {formatDate(doc.expiry_date)}
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDownload(doc)}
              disabled={downloadingId === doc.id}
              loading={downloadingId === doc.id}
              leftIcon="download"
              aria-label={`Download ${doc.file_name}`}
              className="hidden sm:inline-flex"
            >
              Download
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDownload(doc)}
              disabled={downloadingId === doc.id}
              aria-label={`Download ${doc.file_name}`}
              className="sm:hidden"
            >
              <AppIcon name="download" className="w-4 h-4" />
            </Button>

            {confirmDeleteId === doc.id ? (
              <div className="flex items-center gap-1">
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(doc)}
                  disabled={deletingId === doc.id}
                  loading={deletingId === doc.id}
                >
                  Confirm
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setConfirmDeleteId(null)}
                  disabled={deletingId === doc.id}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setConfirmDeleteId(doc.id)}
                aria-label={`Delete ${doc.file_name}`}
              >
                <AppIcon name="trash" className="w-4 h-4 text-muted-foreground hover:text-destructive" />
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
