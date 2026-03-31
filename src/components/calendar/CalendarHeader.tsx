import { cn } from '@/lib/utils'
import { Button, AppIcon } from '@/components/ui'

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

interface CalendarHeaderProps {
  month: number
  year: number
  viewMode: 'list' | 'month'
  onPreviousMonth: () => void
  onNextMonth: () => void
  onToday: () => void
  onViewModeChange: (mode: 'list' | 'month') => void
  className?: string
}

export default function CalendarHeader({
  month,
  year,
  viewMode,
  onPreviousMonth,
  onNextMonth,
  onToday,
  onViewModeChange,
  className,
}: CalendarHeaderProps) {
  const now = new Date()
  const isCurrentMonth =
    month === now.getMonth() + 1 && year === now.getFullYear()

  return (
    <div className={cn('flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between', className)}>
      {/* Month navigation */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onPreviousMonth}
          className="p-2 rounded-lg border border-border hover:bg-surface transition-colors"
          aria-label="Previous month"
        >
          <AppIcon name="chevron-left" className="w-4 h-4 text-foreground" />
        </button>

        <h2 className="text-lg font-bold text-foreground min-w-[180px] text-center">
          {MONTH_NAMES[month - 1]} {year}
        </h2>

        <button
          type="button"
          onClick={onNextMonth}
          className="p-2 rounded-lg border border-border hover:bg-surface transition-colors"
          aria-label="Next month"
        >
          <AppIcon name="chevron-right" className="w-4 h-4 text-foreground" />
        </button>

        {!isCurrentMonth && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToday}
            className="text-xs"
          >
            Today
          </Button>
        )}
      </div>

      {/* View toggle */}
      <div className="flex items-center gap-1 rounded-lg border border-border p-1 self-start sm:self-auto">
        <button
          type="button"
          onClick={() => onViewModeChange('list')}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors',
            viewMode === 'list'
              ? 'bg-primary text-white'
              : 'text-muted-foreground hover:text-foreground',
          )}
          aria-label="List view"
          aria-pressed={viewMode === 'list'}
        >
          <AppIcon name="list-check" className="w-3.5 h-3.5" />
          List
        </button>
        <button
          type="button"
          onClick={() => onViewModeChange('month')}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors',
            viewMode === 'month'
              ? 'bg-primary text-white'
              : 'text-muted-foreground hover:text-foreground',
          )}
          aria-label="Month view"
          aria-pressed={viewMode === 'month'}
        >
          <AppIcon name="calendar-days" className="w-3.5 h-3.5" />
          Month
        </button>
      </div>
    </div>
  )
}
