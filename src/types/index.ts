// Shared type definitions for RUCompliant
// Database types are auto-generated — do not edit database.ts manually

export type { Database, Tables, TablesInsert, TablesUpdate, Enums } from './database'

// Convenience type aliases for common row types
export type { Tables as Row } from './database'

import type { Database } from './database'

// Enum types
export type HealthStatus = Database['public']['Enums']['health_status']
export type BusinessType = Database['public']['Enums']['business_type']
export type TaskType = Database['public']['Enums']['task_type']
export type ActionType = Database['public']['Enums']['action_type']
export type MessageRole = Database['public']['Enums']['message_role']
export type PlanType = Database['public']['Enums']['plan_type']
export type SubscriptionStatus = Database['public']['Enums']['subscription_status']
export type DocumentCategory = Database['public']['Enums']['document_category']

// Row types (shorthand for Tables<'table_name'>)
export type BusinessProfile = Database['public']['Tables']['business_profiles']['Row']
export type ComplianceDomain = Database['public']['Tables']['compliance_domains']['Row']
export type ComplianceDomainScore = Database['public']['Tables']['compliance_domain_scores']['Row']
export type HealthScore = Database['public']['Tables']['health_scores']['Row']
export type ConciergeStage = Database['public']['Tables']['concierge_stages']['Row']
export type ConciergeTask = Database['public']['Tables']['concierge_tasks']['Row']
export type UserConciergeProgress = Database['public']['Tables']['user_concierge_progress']['Row']
export type CalendarTask = Database['public']['Tables']['task_calendar']['Row']
export type Document = Database['public']['Tables']['documents']['Row']
export type AdvisorConversation = Database['public']['Tables']['advisor_conversations']['Row']
export type AdvisorMessage = Database['public']['Tables']['advisor_messages']['Row']
export type Subscription = Database['public']['Tables']['subscriptions']['Row']
export type NotificationPreferences = Database['public']['Tables']['notification_preferences']['Row']
