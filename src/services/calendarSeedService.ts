import { supabase } from '@/lib/supabase'
import type { BusinessType, TaskType } from '@/types'

interface CalendarEntry {
  user_id: string
  title: string
  description: string
  task_type: TaskType
  due_date: string
  domain_id?: string
  source: string
}

/**
 * Calculate statutory deadlines based on business profile.
 * Called after onboarding to populate the task calendar.
 */
export async function seedCalendarForProfile(
  userId: string,
  businessType: BusinessType,
  vatRegistered: boolean | null,
  tradingStartDate: string | null,
  headcount: number,
) {
  // Fetch domain IDs for linking tasks
  const { data: domains } = await supabase
    .from('compliance_domains')
    .select('id, name')

  const domainMap = new Map(domains?.map(d => [d.name, d.id]) ?? [])

  const entries: CalendarEntry[] = []
  const now = new Date()
  const currentYear = now.getFullYear()

  // ── Formation & Registration ─────────────────────────────────────────

  if (businessType === 'limited_company') {
    // Confirmation Statement — due annually on anniversary of incorporation
    // If we don't know the exact date, set it 6 months from now as a reminder
    const confirmationDate = tradingStartDate
      ? getAnniversaryDate(tradingStartDate, currentYear)
      : formatDate(currentYear, now.getMonth() + 7, 1)

    entries.push({
      user_id: userId,
      title: 'File Confirmation Statement',
      description: 'Annual filing with Companies House confirming your company details are up to date.',
      task_type: 'statutory_deadline',
      due_date: confirmationDate,
      domain_id: domainMap.get('Formation & Registration'),
      source: 'onboarding_seed',
    })

    // Annual Accounts — due 9 months after financial year end
    const accountsDate = tradingStartDate
      ? getMonthsAfterAnniversary(tradingStartDate, currentYear, 9)
      : formatDate(currentYear + 1, 3, 31)

    entries.push({
      user_id: userId,
      title: 'File Annual Accounts',
      description: 'Submit your company accounts to Companies House. Due 9 months after your financial year end.',
      task_type: 'statutory_deadline',
      due_date: accountsDate,
      domain_id: domainMap.get('Tax & Financial'),
      source: 'onboarding_seed',
    })

    // Corporation Tax — due 9 months + 1 day after accounting period
    entries.push({
      user_id: userId,
      title: 'Pay Corporation Tax',
      description: 'Corporation Tax payment due to HMRC. Due 9 months and 1 day after your accounting period ends.',
      task_type: 'statutory_deadline',
      due_date: accountsDate, // Same deadline as accounts for simplicity
      domain_id: domainMap.get('Tax & Financial'),
      source: 'onboarding_seed',
    })
  }

  if (businessType === 'sole_trader') {
    // Self Assessment — always 31 January
    const saDate = now.getMonth() >= 1 // After January
      ? formatDate(currentYear + 1, 1, 31)
      : formatDate(currentYear, 1, 31)

    entries.push({
      user_id: userId,
      title: 'File Self Assessment Tax Return',
      description: 'Submit your Self Assessment tax return to HMRC and pay any tax owed.',
      task_type: 'statutory_deadline',
      due_date: saDate,
      domain_id: domainMap.get('Tax & Financial'),
      source: 'onboarding_seed',
    })

    // Payment on Account — 31 January and 31 July
    const poaJuly = formatDate(currentYear, 7, 31)
    if (poaJuly > now.toISOString().split('T')[0]) {
      entries.push({
        user_id: userId,
        title: 'Payment on Account (July)',
        description: 'Second payment on account to HMRC for the current tax year.',
        task_type: 'statutory_deadline',
        due_date: poaJuly,
        domain_id: domainMap.get('Tax & Financial'),
        source: 'onboarding_seed',
      })
    }
  }

  // ── VAT Returns ──────────────────────────────────────────────────────

  if (vatRegistered === true) {
    // Quarterly VAT returns — generate next 4 quarters
    const quarters = getNextVatQuarters(now, 4)
    quarters.forEach((quarter, i) => {
      entries.push({
        user_id: userId,
        title: `VAT Return — Q${i + 1}`,
        description: 'Submit your quarterly VAT return to HMRC. Due 1 month and 7 days after the quarter end.',
        task_type: 'statutory_deadline',
        due_date: quarter,
        domain_id: domainMap.get('Tax & Financial'),
        source: 'onboarding_seed',
      })
    })
  }

  // ── ICO Registration ─────────────────────────────────────────────────

  entries.push({
    user_id: userId,
    title: 'Check ICO Registration',
    description: 'If you process personal data, you may need to register with the Information Commissioner\'s Office (ICO). Registration costs £40/year.',
    task_type: 'compliance_action',
    due_date: formatDate(currentYear, now.getMonth() + 2, 1),
    domain_id: domainMap.get('Data Protection'),
    source: 'onboarding_seed',
  })

  // ── Employment (if has employees) ────────────────────────────────────

  if (headcount > 1) {
    entries.push({
      user_id: userId,
      title: 'Check Employer\'s Liability Insurance',
      description: 'By law, you must have Employer\'s Liability insurance if you have employees. The minimum cover is £5 million.',
      task_type: 'compliance_action',
      due_date: formatDate(currentYear, now.getMonth() + 1, 15),
      domain_id: domainMap.get('Insurance'),
      source: 'onboarding_seed',
    })

    entries.push({
      user_id: userId,
      title: 'Review Employment Contracts',
      description: 'All employees must receive a written statement of employment terms on or before their first day.',
      task_type: 'compliance_action',
      due_date: formatDate(currentYear, now.getMonth() + 1, 15),
      domain_id: domainMap.get('Employment & People'),
      source: 'onboarding_seed',
    })
  }

  // ── Insert all entries ───────────────────────────────────────────────

  if (entries.length > 0) {
    const { error } = await supabase
      .from('task_calendar')
      .insert(entries)

    if (error) throw error
  }

  return entries.length
}

// ── Helper Functions ─────────────────────────────────────────────────────

function formatDate(year: number, month: number, day: number): string {
  // Clamp month to 1-12
  const m = Math.min(12, Math.max(1, month))
  // Clamp day to valid range for month
  const maxDay = new Date(year, m, 0).getDate()
  const d = Math.min(maxDay, Math.max(1, day))
  return `${year}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

function getAnniversaryDate(tradingStartDate: string, currentYear: number): string {
  const start = new Date(tradingStartDate)
  const month = start.getMonth() + 1
  const day = start.getDate()
  const anniversary = formatDate(currentYear, month, day)

  // If anniversary has passed this year, use next year
  const today = new Date().toISOString().split('T')[0]
  return anniversary <= today
    ? formatDate(currentYear + 1, month, day)
    : anniversary
}

function getMonthsAfterAnniversary(tradingStartDate: string, currentYear: number, months: number): string {
  const start = new Date(tradingStartDate)
  const yearEndMonth = start.getMonth() + 1
  const targetMonth = yearEndMonth + months
  const targetYear = currentYear + Math.floor((targetMonth - 1) / 12)
  const actualMonth = ((targetMonth - 1) % 12) + 1
  return formatDate(targetYear, actualMonth, 1)
}

function getNextVatQuarters(from: Date, count: number): string[] {
  // VAT quarters end: Mar 31, Jun 30, Sep 30, Dec 31
  // Return is due 1 month + 7 days after quarter end
  const quarterEnds = [
    { month: 3, day: 31 },
    { month: 6, day: 30 },
    { month: 9, day: 30 },
    { month: 12, day: 31 },
  ]

  const results: string[] = []
  let year = from.getFullYear()
  let startIdx = quarterEnds.findIndex(q => {
    const qEnd = new Date(year, q.month - 1, q.day)
    return qEnd >= from
  })

  if (startIdx === -1) {
    year++
    startIdx = 0
  }

  for (let i = 0; i < count; i++) {
    const idx = (startIdx + i) % 4
    const qYear = year + Math.floor((startIdx + i) / 4)
    const q = quarterEnds[idx]
    // Due date = quarter end + 1 month + 7 days
    const dueMonth = q.month + 1
    const dueYear = dueMonth > 12 ? qYear + 1 : qYear
    const actualMonth = dueMonth > 12 ? dueMonth - 12 : dueMonth
    results.push(formatDate(dueYear, actualMonth, 7))
  }

  return results
}
