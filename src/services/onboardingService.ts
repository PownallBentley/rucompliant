import { supabase } from '@/lib/supabase'
import type { BusinessType } from '@/types'

interface OnboardingAnswers {
  business_structure: string
  headcount: string
  vat_registered: string
  sector: string
  trading_start_date: string
}

function mapBusinessType(answer: string): BusinessType {
  switch (answer) {
    case 'sole_trader': return 'sole_trader'
    case 'limited_company': return 'limited_company'
    case 'partnership': return 'partnership'
    default: return 'sole_trader' // "not_sure" defaults to sole trader
  }
}

function mapHeadcount(answer: string): number {
  switch (answer) {
    case 'just_me': return 1
    case '2_4': return 3
    case '5_9': return 7
    case '10_plus': return 10
    default: return 1
  }
}

function mapVatRegistered(answer: string): boolean | null {
  switch (answer) {
    case 'yes': return true
    case 'no': return false
    default: return null // "not_sure"
  }
}

export async function saveBusinessProfile(userId: string, answers: OnboardingAnswers) {
  const tradingDate = answers.trading_start_date && answers.trading_start_date !== 'not_started'
    ? answers.trading_start_date
    : null

  const { error } = await supabase
    .from('business_profiles')
    .upsert({
      user_id: userId,
      business_type: mapBusinessType(answers.business_structure),
      headcount: mapHeadcount(answers.headcount),
      vat_registered: mapVatRegistered(answers.vat_registered),
      sector: answers.sector || null,
      trading_start_date: tradingDate,
      onboarding_completed: true,
    }, { onConflict: 'user_id' })

  if (error) throw error
}

export async function createInitialHealthScore(userId: string) {
  // Initial score is always Amber — user needs to complete Concierge Journey for Green
  const { error } = await supabase
    .from('health_scores')
    .upsert({
      user_id: userId,
      overall_status: 'amber' as const,
      previous_status: null,
    }, { onConflict: 'user_id' })

  if (error) throw error
}

export async function createInitialDomainScores(userId: string, headcount: number) {
  // Fetch all domains
  const { data: domains, error: fetchError } = await supabase
    .from('compliance_domains')
    .select('id, name')
    .order('display_order')

  if (fetchError || !domains) throw fetchError

  // Domains that only apply when business has employees
  const employeeRequired = ['Health & Safety', 'Employment & People', 'Insurance']

  const scores = domains.map(domain => ({
    user_id: userId,
    domain_id: domain.id,
    status: 'amber' as const, // Everything starts as Amber
    ...(employeeRequired.includes(domain.name) && headcount <= 1
      ? { status: 'green' as const } // No employees = these domains are Green
      : {}),
  }))

  const { error } = await supabase
    .from('compliance_domain_scores')
    .upsert(scores, { onConflict: 'user_id,domain_id' })

  if (error) throw error
}

export async function completeOnboarding(userId: string, answers: Record<string, string>) {
  const onboardingAnswers: OnboardingAnswers = {
    business_structure: answers.business_structure || 'sole_trader',
    headcount: answers.headcount || 'just_me',
    vat_registered: answers.vat_registered || 'no',
    sector: answers.sector || '',
    trading_start_date: answers.trading_start_date || '',
  }

  await saveBusinessProfile(userId, onboardingAnswers)
  await createInitialHealthScore(userId)
  await createInitialDomainScores(userId, mapHeadcount(onboardingAnswers.headcount))
}
