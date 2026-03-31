import { supabase } from '@/lib/supabase'
import type { CalendarTask, HealthStatus } from '@/types'

export interface CalendarTaskWithDomain extends CalendarTask {
  domainName: string | null
  urgency: HealthStatus
}

/**
 * Calculate urgency status based on due date relative to today.
 * Red = overdue, Amber = due within 14 days, Green = more than 14 days out.
 */
export function getTaskUrgency(dueDate: string): HealthStatus {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const due = new Date(dueDate)
  due.setHours(0, 0, 0, 0)
  const diffMs = due.getTime() - today.getTime()
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return 'red'
  if (diffDays <= 14) return 'amber'
  return 'green'
}

/**
 * Fetch calendar tasks for a user, optionally filtered by month/year.
 * Joins compliance_domains to get the domain name.
 */
export async function fetchCalendarTasks(
  userId: string,
  options?: { month?: number; year?: number },
): Promise<CalendarTaskWithDomain[]> {
  let query = supabase
    .from('task_calendar')
    .select(`
      *,
      compliance_domains(name)
    `)
    .eq('user_id', userId)
    .order('due_date', { ascending: true })

  if (options?.month != null && options?.year != null) {
    const startDate = `${options.year}-${String(options.month).padStart(2, '0')}-01`
    const lastDay = new Date(options.year, options.month, 0).getDate()
    const endDate = `${options.year}-${String(options.month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`
    query = query.gte('due_date', startDate).lte('due_date', endDate)
  }

  const { data, error } = await query

  if (error) throw error
  if (!data) return []

  return data.map(task => {
    const domainData = task.compliance_domains as unknown as { name: string } | null
    return {
      ...task,
      compliance_domains: undefined,
      domainName: domainData?.name ?? null,
      urgency: getTaskUrgency(task.due_date),
    } as CalendarTaskWithDomain
  })
}

/**
 * Mark a calendar task as complete.
 */
export async function markCalendarTaskComplete(taskId: string): Promise<void> {
  const { error } = await supabase
    .from('task_calendar')
    .update({
      completed: true,
      completed_at: new Date().toISOString(),
    })
    .eq('id', taskId)

  if (error) throw error
}

/**
 * Fetch all overdue, incomplete tasks for a user.
 */
export async function getOverdueTasks(
  userId: string,
): Promise<CalendarTaskWithDomain[]> {
  const today = new Date().toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('task_calendar')
    .select(`
      *,
      compliance_domains(name)
    `)
    .eq('user_id', userId)
    .eq('completed', false)
    .lt('due_date', today)
    .order('due_date', { ascending: true })

  if (error) throw error
  if (!data) return []

  return data.map(task => {
    const domainData = task.compliance_domains as unknown as { name: string } | null
    return {
      ...task,
      compliance_domains: undefined,
      domainName: domainData?.name ?? null,
      urgency: 'red' as HealthStatus,
    } as CalendarTaskWithDomain
  })
}
