import { supabase } from '@/lib/supabase'
import type { HealthStatus } from '@/types'

export interface ConciergeStage {
  id: string
  stageNumber: number
  name: string
  description: string
}

export interface ConciergeTaskData {
  id: string
  stageId: string
  title: string
  description: string
  actionType: 'external_link' | 'internal_workflow' | 'mark_done' | 'upload_document'
  actionUrl: string | null
  domainName: string | null
  displayOrder: number
  completed: boolean
  completedAt: string | null
}

export interface StageProgress {
  stageId: string
  total: number
  completed: number
  percentage: number
}

export async function fetchStages(): Promise<ConciergeStage[]> {
  const { data } = await supabase
    .from('concierge_stages')
    .select('id, stage_number, name, description')
    .order('stage_number')

  if (!data) return []

  return data.map(s => ({
    id: s.id,
    stageNumber: s.stage_number,
    name: s.name,
    description: s.description,
  }))
}

export async function fetchTasksForStage(
  userId: string,
  stageId: string,
  businessType: string,
  headcount: number,
): Promise<ConciergeTaskData[]> {
  // Fetch tasks for this stage with domain names
  const { data: tasks } = await supabase
    .from('concierge_tasks')
    .select(`
      id,
      stage_id,
      title,
      description,
      action_type,
      action_url,
      display_order,
      applies_to,
      compliance_domains(name)
    `)
    .eq('stage_id', stageId)
    .order('display_order')

  if (!tasks) return []

  // Fetch user progress for these tasks
  const taskIds = tasks.map(t => t.id)
  const { data: progress } = await supabase
    .from('user_concierge_progress')
    .select('task_id, completed, completed_at')
    .eq('user_id', userId)
    .in('task_id', taskIds)

  const progressMap = new Map(
    progress?.map(p => [p.task_id, { completed: p.completed, completedAt: p.completed_at }]) ?? []
  )

  // Filter tasks by applies_to rules
  return tasks
    .filter(task => {
      const rules = task.applies_to as Record<string, unknown>
      if (!rules || Object.keys(rules).length === 0) return true

      // Check business_type filter
      if (rules.business_type) {
        const allowedTypes = rules.business_type as string[]
        if (!allowedTypes.includes(businessType)) return false
      }

      // Check min_headcount filter
      if (rules.min_headcount) {
        if (headcount < (rules.min_headcount as number)) return false
      }

      return true
    })
    .map(task => {
      const prog = progressMap.get(task.id)
      const domainData = task.compliance_domains as unknown as { name: string } | null

      return {
        id: task.id,
        stageId: task.stage_id,
        title: task.title,
        description: task.description,
        actionType: task.action_type,
        actionUrl: task.action_url,
        domainName: domainData?.name ?? null,
        displayOrder: task.display_order,
        completed: prog?.completed ?? false,
        completedAt: prog?.completedAt ?? null,
      }
    })
}

export async function markTaskDone(userId: string, taskId: string): Promise<void> {
  const { error: insertError } = await supabase
    .from('user_concierge_progress')
    .insert({
      user_id: userId,
      task_id: taskId,
      completed: true,
      completed_at: new Date().toISOString(),
    })

  if (insertError && insertError.code === '23505') {
    // Already exists — update
    await supabase
      .from('user_concierge_progress')
      .update({ completed: true, completed_at: new Date().toISOString() })
      .eq('user_id', userId)
      .eq('task_id', taskId)
  } else if (insertError) {
    throw insertError
  }
}

export function getStageProgress(tasks: ConciergeTaskData[]): StageProgress {
  const total = tasks.length
  const completed = tasks.filter(t => t.completed).length
  return {
    stageId: tasks[0]?.stageId ?? '',
    total,
    completed,
    percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
  }
}

export function getTaskStatus(task: ConciergeTaskData): HealthStatus {
  if (task.completed) return 'green'
  return 'amber'
}
