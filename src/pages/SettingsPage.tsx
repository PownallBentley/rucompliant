import { Card, AppIcon } from '@/components/ui'

export default function SettingsPage() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <AppIcon name="settings" className="w-7 h-7 text-primary" />
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
      </div>
      <Card padding="lg">
        <p className="text-muted-foreground">
          Account settings and preferences will appear here. Coming soon.
        </p>
      </Card>
    </div>
  )
}
