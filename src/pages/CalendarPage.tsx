import { Card, AppIcon } from '@/components/ui'

export default function CalendarPage() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <AppIcon name="calendar" className="w-7 h-7 text-primary" />
        <h1 className="text-2xl font-bold text-foreground">Compliance Calendar</h1>
      </div>
      <Card padding="lg">
        <p className="text-muted-foreground">
          Your statutory deadlines and compliance tasks will appear here. Coming soon.
        </p>
      </Card>
    </div>
  )
}
