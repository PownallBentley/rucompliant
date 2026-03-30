import { Card, AppIcon } from '@/components/ui'

export default function ConciergePage() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <AppIcon name="compass" className="w-7 h-7 text-primary" />
        <h1 className="text-2xl font-bold text-foreground">Compliance Journey</h1>
      </div>
      <Card padding="lg">
        <p className="text-muted-foreground">
          Your guided compliance journey will appear here. Coming soon.
        </p>
      </Card>
    </div>
  )
}
