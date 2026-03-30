import { Card, AppIcon } from '@/components/ui'

export default function DocumentsPage() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <AppIcon name="folder" className="w-7 h-7 text-primary" />
        <h1 className="text-2xl font-bold text-foreground">Document Vault</h1>
      </div>
      <Card padding="lg">
        <p className="text-muted-foreground">
          Your compliance documents will be stored here. Coming soon.
        </p>
      </Card>
    </div>
  )
}
