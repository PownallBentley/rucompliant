import { useState, useRef, useCallback, type DragEvent, type ChangeEvent } from 'react'
import { Modal, Button, AppIcon } from '@/components/ui'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui'
import { Input } from '@/components/ui'
import { Label } from '@/components/ui'
import { cn } from '@/lib/utils'
import { uploadDocument, validateFile, ALL_CATEGORIES, CATEGORY_LABELS } from '@/services/documentService'
import type { DocumentCategory, Document } from '@/types'

interface DocumentUploadProps {
  isOpen: boolean
  onClose: () => void
  userId: string
  onUploadComplete: (doc: Document) => void
}

export default function DocumentUpload({
  isOpen,
  onClose,
  userId,
  onUploadComplete,
}: DocumentUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [category, setCategory] = useState<DocumentCategory | ''>('')
  const [expiryDate, setExpiryDate] = useState('')
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const reset = useCallback(() => {
    setFile(null)
    setCategory('')
    setExpiryDate('')
    setError('')
    setUploading(false)
    setDragOver(false)
  }, [])

  const handleClose = useCallback(() => {
    reset()
    onClose()
  }, [onClose, reset])

  const handleFile = useCallback((f: File) => {
    const validationError = validateFile(f)
    if (validationError) {
      setError(validationError)
      setFile(null)
      return
    }
    setError('')
    setFile(f)
  }, [])

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setDragOver(false)
      const dropped = e.dataTransfer.files[0]
      if (dropped) handleFile(dropped)
    },
    [handleFile]
  )

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragOver(false)
  }, [])

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files?.[0]
      if (selected) handleFile(selected)
    },
    [handleFile]
  )

  const handleUpload = async () => {
    if (!file || !category) return
    setUploading(true)
    setError('')

    try {
      const doc = await uploadDocument(
        userId,
        file,
        category as DocumentCategory,
        expiryDate || undefined
      )
      onUploadComplete(doc)
      handleClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed. Please try again.')
      setUploading(false)
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Upload Document"
      subtitle="Add a document to your vault. PDF, JPG and PNG files up to 25 MB."
      maxWidth="md"
      footer={
        <div className="flex gap-3 w-full justify-end">
          <Button variant="secondary" onClick={handleClose} disabled={uploading}>
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!file || !category || uploading}
            loading={uploading}
            leftIcon="upload"
          >
            Upload
          </Button>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Drop zone */}
        <div
          role="button"
          tabIndex={0}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click()
          }}
          className={cn(
            'flex flex-col items-center justify-center gap-3 p-8 rounded-xl border-2 border-dashed cursor-pointer transition-colors',
            dragOver
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50 hover:bg-primary/5'
          )}
        >
          <AppIcon
            name="upload"
            className={cn('w-8 h-8', dragOver ? 'text-primary' : 'text-muted-foreground')}
          />
          {file ? (
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">{file.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{formatFileSize(file.size)}</p>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">
                Drag and drop your file here
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                or click to browse
              </p>
            </div>
          )}
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleInputChange}
            className="hidden"
            aria-label="Choose file to upload"
          />
        </div>

        {/* Category selector */}
        <div className="space-y-2">
          <Label htmlFor="doc-category">Category</Label>
          <Select
            value={category}
            onValueChange={(val) => setCategory(val as DocumentCategory)}
          >
            <SelectTrigger id="doc-category">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {ALL_CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {CATEGORY_LABELS[cat]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Optional expiry date */}
        <div className="space-y-2">
          <Label htmlFor="doc-expiry">Expiry date (optional)</Label>
          <Input
            id="doc-expiry"
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
          />
        </div>

        {/* Error message */}
        {error && (
          <div className="flex items-center gap-2 text-destructive text-sm">
            <AppIcon name="alert-circle" className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>
    </Modal>
  )
}
