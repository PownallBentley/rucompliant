import { cn } from '@/lib/utils'
import type { CalendarTaskWithDomain } from '@/services/calendarService'

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const URGENCY_DOT_CLASS = {
  red: 'bg-status-red',
  amber: 'bg-status-amber',
  green: 'bg-status-green',
} as const

interface MonthGridProps {
  month: number
  year: number
  tasks: CalendarTaskWithDomain[]
  className?: string
}

export default function MonthGrid({ month, year, tasks, className }: MonthGridProps) {
  const firstDay = new Date(year, month - 1, 1)
  const lastDay = new Date(year, month, 0)
  const daysInMonth = lastDay.getDate()

  // Monday = 0, Sunday = 6
  let startDayOfWeek = firstDay.getDay() - 1
  if (startDayOfWeek < 0) startDayOfWeek = 6

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const isCurrentMonth = month === today.getMonth() + 1 && year === today.getFullYear()

  // Group tasks by day number
  const tasksByDay = new Map<number, CalendarTaskWithDomain[]>()
  for (const task of tasks) {
    const taskDate = new Date(task.due_date)
    const day = taskDate.getDate()
    const existing = tasksByDay.get(day) ?? []
    existing.push(task)
    tasksByDay.set(day, existing)
  }

  // Build grid cells: leading empty + days of month
  const cells: (number | null)[] = []
  for (let i = 0; i < startDayOfWeek; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <div className={cn('border border-border rounded-xl overflow-hidden', className)}>
      {/* Day name headers */}
      <div className="grid grid-cols-7 bg-surface">
        {DAY_NAMES.map((name) => (
          <div key={name} className="py-2 text-center text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            {name}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7">
        {cells.map((day, idx) => {
          const dayTasks = day ? tasksByDay.get(day) ?? [] : []
          const isToday = isCurrentMonth && day === today.getDate()

          return (
            <div
              key={idx}
              className={cn(
                'min-h-[64px] sm:min-h-[80px] border-t border-l border-border p-1.5 sm:p-2',
                idx % 7 === 0 && 'border-l-0',
                !day && 'bg-surface/50',
              )}
            >
              {day != null && (
                <>
                  <span
                    className={cn(
                      'inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold',
                      isToday
                        ? 'bg-primary text-white'
                        : 'text-foreground',
                    )}
                  >
                    {day}
                  </span>
                  {dayTasks.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {dayTasks.slice(0, 3).map((task) => (
                        <span
                          key={task.id}
                          className={cn(
                            'w-2 h-2 rounded-full shrink-0',
                            task.completed
                              ? 'bg-muted-foreground/30'
                              : URGENCY_DOT_CLASS[task.urgency],
                          )}
                          title={task.title}
                        />
                      ))}
                      {dayTasks.length > 3 && (
                        <span className="text-[10px] text-muted-foreground leading-none">
                          +{dayTasks.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
