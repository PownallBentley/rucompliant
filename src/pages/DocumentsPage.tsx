import { useState, useEffect, useCallback } from 'react'
import { AppIcon, Button, LoadingSpinner } from '@/components/ui'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui'
import DocumentUpload from '@/components/vault/DocumentUpload'
import DocumentList from '@/components/vault/DocumentList'
import { fetchDocuments, ALL_CATEGORIES, CATEGORY_LABELS } from '@/services/documentService'
import { useAuthStore } from '@/stores/authStore'
import type { Document, DocumentCategory } from '@/types'

type TabValue = 'all' | DocumentCategory

export default function DocumentsPage() {
  const user = useAuthStore((s) => s.user)
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabValue>('all')
  const [uploadOpen, setUploadOpen] = useState(false)

  const loadDocuments = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const docs = await fetchDocuments(user.id)
      setDocuments(docs)
    } catch {
      // Could surface error via toast in future
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    loadDocuments()
  }, [loadDocuments])

  const handleUploadComplete = useCallback((doc: Document) => {
    setDocuments((prev) => [doc, ...prev])
  }, [])

  const handleDocumentDeleted = useCallback((documentId: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== documentId))
  }, [])

  const filteredDocuments =
    activeTab === 'all'
      ? documents
      : documents.filter((d) => d.category === activeTab)

  const tabCategories: { value: TabValue; label: string }[] = [
    { value: 'all', label: 'All' },
    ...ALL_CATEGORIES.map((cat) => ({
      value: cat as TabValue,
      label: CATEGORY_LABELS[cat],
    })),
  ]

  return (
    <div className="bg-page min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <AppIcon name="folder" className="w-7 h-7 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Document Vault</h1>
        </div>
        <Button leftIcon="upload" onClick={() => setUploadOpen(true)}>
          Upload
        </Button>
      </div>

      {/* Category tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as TabValue)}
      >
        <TabsList className="flex flex-wrap h-auto gap-1 bg-transparent p-0 mb-6">
          {tabCategories.map(({ value, label }) => {
            const count =
              value === 'all'
                ? documents.length
                : documents.filter((d) => d.category === value).length

            return (
              <TabsTrigger
                key={value}
                value={value}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-3 py-1.5 text-sm"
              >
                {label}
                {count > 0 && (
                  <span className="ml-1.5 text-xs opacity-70">({count})</span>
                )}
              </TabsTrigger>
            )
          })}
        </TabsList>

        {/* Content for each tab */}
        {loading ? (
          <div className="flex justify-center py-16">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <>
            <TabsContent value="all">
              <DocumentList
                documents={filteredDocuments}
                userId={user?.id ?? ''}
                selectedCategory="all"
                onDocumentDeleted={handleDocumentDeleted}
              />
            </TabsContent>
            {ALL_CATEGORIES.map((cat) => (
              <TabsContent key={cat} value={cat}>
                <DocumentList
                  documents={documents.filter((d) => d.category === cat)}
                  userId={user?.id ?? ''}
                  selectedCategory={cat}
                  onDocumentDeleted={handleDocumentDeleted}
                />
              </TabsContent>
            ))}
          </>
        )}
      </Tabs>

      {/* Upload modal */}
      {user && (
        <DocumentUpload
          isOpen={uploadOpen}
          onClose={() => setUploadOpen(false)}
          userId={user.id}
          onUploadComplete={handleUploadComplete}
        />
      )}
    </div>
  )
}
