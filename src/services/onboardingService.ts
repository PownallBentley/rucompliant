import { supabase } from '@/lib/supabase'
import type { BusinessType } from '@/types'
import { seedCalendarForProfile } from './calendarSeedService'

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
  let tradingDate: string | null = null
  if (answers.trading_start_date && answers.trading_start_date !== 'not_started') {
    // Ensure full date format (YYYY-MM-DD) — QuestionFlow may return YYYY-MM
    const raw = answers.trading_start_date
    tradingDate = raw.length <= 7 ? `${raw}-01` : raw
  }

  const profileData = {
    user_id: userId,
    business_type: mapBusinessType(answers.business_structure),
    headcount: mapHeadcount(answers.headcount),
    vat_registered: mapVatRegistered(answers.vat_registered),
    sector: answers.sector || null,
    trading_start_date: tradingDate,
    onboarding_completed: true,
  }

  // Try insert first, update if already exists
  const { error: insertError } = await supabase
    .from('business_profiles')
    .insert(profileData)

  if (insertError) {
    if (insertError.code === '23505') {
      // Unique violation — profile exists, update instead
      const { user_id: _, ...updateData } = profileData
      const { error: updateError } = await supabase
        .from('business_profiles')
        .update(updateData)
        .eq('user_id', userId)
      if (updateError) throw updateError
    } else {
      throw insertError
    }
  }
}

export async function createInitialHealthScore(userId: string) {
  const { error: insertError } = await supabase
    .from('health_scores')
    .insert({
      user_id: userId,
      overall_status: 'amber' as const,
      previous_status: null,
    })

  if (insertError && insertError.code === '23505') {
    // Already exists — update
    const { error: updateError } = await supabase
      .from('health_scores')
      .update({ overall_status: 'amber' as const })
      .eq('user_id', userId)
    if (updateError) throw updateError
  } else if (insertError) {
    throw insertError
  }
}

export async function createInitialDomainScores(userId: string, headcount: number) {
  const { data: domains, error: fetchError } = await supabase
    .from('compliance_domains')
    .select('id, name')
    .order('display_order')

  if (fetchError || !domains) throw fetchError

  // Domains that only apply when business has employees
  const employeeRequired = ['Health & Safety', 'Employment & People', 'Insurance']

  for (const domain of domains) {
    const status = (employeeRequired.includes(domain.name) && headcount <= 1)
      ? 'green' as const
      : 'amber' as const

    const { error: insertError } = await supabase
      .from('compliance_domain_scores')
      .insert({
        user_id: userId,
        domain_id: domain.id,
        status,
      })

    if (insertError && insertError.code === '23505') {
      // Already exists — update
      await supabase
        .from('compliance_domain_scores')
        .update({ status })
        .eq('user_id', userId)
        .eq('domain_id', domain.id)
    } else if (insertError) {
      throw insertError
    }
  }
}

export async function completeOnboarding(userId: string, answers: Record<string, string>) {
  const onboardingAnswers: OnboardingAnswers = {
    business_structure: answers.business_structure || 'sole_trader',
    headcount: answers.headcount || 'just_me',
    vat_registered: answers.vat_registered || 'no',
    sector: answers.sector || '',
    trading_start_date: answers.trading_start_date || '',
  }

  const headcount = mapHeadcount(onboardingAnswers.headcount)
  const businessType = mapBusinessType(onboardingAnswers.business_structure)
  const vatRegistered = mapVatRegistered(onboardingAnswers.vat_registered)

  await saveBusinessProfile(userId, onboardingAnswers)
  await createInitialHealthScore(userId)
  await createInitialDomainScores(userId, headcount)
  await seedCalendarForProfile(
    userId,
    businessType,
    vatRegistered,
    onboardingAnswers.trading_start_date || null,
    headcount,
  )
}
