import { useEffect, useCallback } from 'react'
import { AppIcon, LoadingSpinner, EmptyState } from '@/components/ui'
import { useAuthStore } from '@/stores/authStore'
import { useCalendarStore } from '@/stores/calendarStore'
import {
  fetchCalendarTasks,
  markCalendarTaskComplete,
} from '@/services/calendarService'
import CalendarHeader from '@/components/calendar/CalendarHeader'
import MonthGrid from '@/components/calendar/MonthGrid'
import TaskList from '@/components/shared/TaskList'
import type { TaskItemData } from '@/components/shared/TaskItem'

/**
 * Format a date string (YYYY-MM-DD) into a readable label like "Mon 14 Apr".
 */
function formatDateLabel(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

/**
 * Group tasks by their due date for the list view.
 */
function groupTasksByDate(
  tasks: TaskItemData[],
  rawDates: Map<string, string>,
): { date: string; label: string; tasks: TaskItemData[] }[] {
  const groups = new Map<string, TaskItemData[]>()

  for (const task of tasks) {
    const rawDate = rawDates.get(task.id) ?? ''
    const existing = groups.get(rawDate) ?? []
    existing.push(task)
    groups.set(rawDate, existing)
  }

  return Array.from(groups.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, dateTasks]) => ({
      date,
      label: formatDateLabel(date),
      tasks: dateTasks,
    }))
}

export default function CalendarPage() {
  const user = useAuthStore((s) => s.user)
  const {
    tasks,
    viewMode,
    selectedMonth,
    selectedYear,
    loading,
    setTasks,
    setViewMode,
    setLoading,
    goToPreviousMonth,
    goToNextMonth,
    goToToday,
  } = useCalendarStore()

  const loadTasks = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const data = await fetchCalendarTasks(user.id, {
        month: selectedMonth,
        year: selectedYear,
      })
      setTasks(data)
    } catch (err) {
      console.error('Failed to load calendar tasks:', err)
    } finally {
      setLoading(false)
    }
  }, [user, selectedMonth, selectedYear, setTasks, setLoading])

  useEffect(() => {
    loadTasks()
  }, [loadTasks])

  const handleMarkDone = useCallback(
    async (taskId: string) => {
      try {
        await markCalendarTaskComplete(taskId)
        await loadTasks()
      } catch (err) {
        console.error('Failed to mark task complete:', err)
      }
    },
    [loadTasks],
  )

  // Convert CalendarTaskWithDomain into TaskItemData for TaskList
  const taskItems: TaskItemData[] = tasks.map((t) => ({
    id: t.id,
    title: t.title,
    description: t.domainName
      ? `${t.domainName} — ${t.description ?? ''}`
      : t.description ?? undefined,
    status: t.urgency,
    dueDate: formatDateLabel(t.due_date),
    completed: t.completed,
  }))

  // Keep a map of task ID -> raw date for grouping
  const rawDatesMap = new Map(tasks.map((t) => [t.id, t.due_date]))

  const dateGroups = groupTasksByDate(taskItems, rawDatesMap)

  return (
    <div className="bg-page min-h-full">
      {/* Page header */}
      <div className="flex items-center gap-3 mb-6">
        <AppIcon name="calendar" className="w-7 h-7 text-primary" />
        <h1 className="text-2xl font-bold text-foreground">
          Compliance Calendar
        </h1>
      </div>

      {/* Calendar header with navigation and view toggle */}
      <CalendarHeader
        month={selectedMonth}
        year={selectedYear}
        viewMode={viewMode}
        onPreviousMonth={goToPreviousMonth}
        onNextMonth={goToNextMonth}
        onToday={goToToday}
        onViewModeChange={setViewMode}
        className="mb-6"
      />

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-16">
          <LoadingSpinner size="lg" />
        </div>
      ) : viewMode === 'month' ? (
        /* ── Month grid view ── */
        <MonthGrid
          month={selectedMonth}
          year={selectedYear}
          tasks={tasks}
        />
      ) : tasks.length === 0 ? (
        /* ── Empty state ── */
        <EmptyState
          icon="calendar"
          title="No deadlines this month"
          description="You have no compliance tasks due this month. Use the arrows to check other months."
        />
      ) : (
        /* ── List view grouped by date ── */
        <div className="flex flex-col gap-6">
          {dateGroups.map((group) => (
            <div key={group.date}>
              <p className="text-[10px] font-bold uppercase tracking-[0.8px] text-muted-foreground mb-3">
                {group.label}
              </p>
              <TaskList
                tasks={group.tasks}
                variant="timeline"
                onMarkDone={handleMarkDone}
                emptyTitle="No deadlines this month"
                emptyDescription="You have no compliance tasks due this month."
                emptyIcon="calendar"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
