import { supabase } from '@/lib/supabase'
import type { HealthStatus } from '@/types'

export interface DomainScore {
  id: string
  domainId: string
  domainName: string
  domainDescription: string
  displayOrder: number
  status: HealthStatus
}

export interface HealthScoreData {
  overallStatus: HealthStatus
  previousStatus: HealthStatus | null
  calculatedAt: string
}

export interface NextAction {
  id: string
  title: string
  description: string | null
  dueDate: string
  taskType: string
  completed: boolean
  domainName: string | null
  status: HealthStatus
}

export async function fetchHealthScore(userId: string): Promise<HealthScoreData | null> {
  const { data } = await supabase
    .from('health_scores')
    .select('overall_status, previous_status, calculated_at')
    .eq('user_id', userId)
    .maybeSingle()

  if (!data) return null

  return {
    overallStatus: data.overall_status,
    previousStatus: data.previous_status,
    calculatedAt: data.calculated_at,
  }
}

export async function fetchDomainScores(userId: string): Promise<DomainScore[]> {
  // Fetch domains and user scores in parallel
  const [{ data: domains }, { data: scores }] = await Promise.all([
    supabase
      .from('compliance_domains')
      .select('id, name, description, display_order')
      .order('display_order'),
    supabase
      .from('compliance_domain_scores')
      .select('domain_id, status')
      .eq('user_id', userId),
  ])

  if (!domains) return []

  const scoreMap = new Map(scores?.map(s => [s.domain_id, s.status]) ?? [])

  return domains.map(domain => ({
    id: domain.id,
    domainId: domain.id,
    domainName: domain.name,
    domainDescription: domain.description,
    displayOrder: domain.display_order,
    status: (scoreMap.get(domain.id) as HealthStatus) ?? 'amber',
  }))
}

export async function fetchNextActions(userId: string, limit = 3): Promise<NextAction[]> {
  const today = new Date().toISOString().split('T')[0]

  const { data } = await supabase
    .from('task_calendar')
    .select(`
      id,
      title,
      description,
      due_date,
      task_type,
      completed,
      domain_id,
      compliance_domains(name)
    `)
    .eq('user_id', userId)
    .eq('completed', false)
    .order('due_date', { ascending: true })
    .limit(limit)

  if (!data) return []

  return data.map(task => {
    // Determine urgency status based on due date
    const dueDate = task.due_date
    const daysUntilDue = Math.ceil(
      (new Date(dueDate).getTime() - new Date(today).getTime()) / (1000 * 60 * 60 * 24)
    )

    let status: HealthStatus = 'green'
    if (daysUntilDue <= 0) status = 'red'
    else if (daysUntilDue <= 14) status = 'amber'

    // Handle the joined domain name
    const domainData = task.compliance_domains as unknown as { name: string } | null

    return {
      id: task.id,
      title: task.title,
      description: task.description,
      dueDate: task.due_date,
      taskType: task.task_type,
      completed: task.completed,
      domainName: domainData?.name ?? null,
      status,
    }
  })
}

/**
 * Calculate overall health status from domain scores.
 * Rule: overall = worst single domain (PRD Section 5.2)
 */
export function calculateOverallStatus(domainScores: DomainScore[]): HealthStatus {
  if (domainScores.some(d => d.status === 'red')) return 'red'
  if (domainScores.some(d => d.status === 'amber')) return 'amber'
  return 'green'
}
