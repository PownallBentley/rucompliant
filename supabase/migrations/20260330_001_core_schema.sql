-- ============================================================================
-- RUCompliant Core Schema
-- Migration 001: All foundation tables + RLS + seed data
-- ============================================================================

-- ── Enums ──────────────────────────────────────────────────────────────────

create type business_type as enum ('sole_trader', 'limited_company', 'partnership');
create type health_status as enum ('green', 'amber', 'red');
create type task_type as enum ('statutory_deadline', 'compliance_action', 'trigger_event', 'review_renewal');
create type action_type as enum ('external_link', 'internal_workflow', 'mark_done', 'upload_document');
create type message_role as enum ('user', 'assistant');
create type plan_type as enum ('monthly', 'annual');
create type subscription_status as enum ('trialing', 'active', 'past_due', 'canceled', 'unpaid');
create type document_category as enum ('formation', 'contracts', 'policies', 'insurance', 'tax_accounts', 'health_safety', 'training');

-- ── Business Profiles ──────────────────────────────────────────────────────

create table business_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  business_type business_type not null,
  headcount int not null default 1,
  vat_registered boolean,
  sector text,
  trading_start_date date,
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id)
);

-- ── Compliance Domains (seed table) ────────────────────────────────────────

create table compliance_domains (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text not null,
  display_order int not null,
  created_at timestamptz not null default now()
);

-- ── Compliance Domain Scores ───────────────────────────────────────────────

create table compliance_domain_scores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  domain_id uuid not null references compliance_domains(id) on delete cascade,
  status health_status not null default 'amber',
  last_assessed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, domain_id)
);

-- ── Health Scores ──────────────────────────────────────────────────────────

create table health_scores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  overall_status health_status not null default 'amber',
  previous_status health_status,
  calculated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (user_id)
);

-- ── Concierge Stages (seed table) ──────────────────────────────────────────

create table concierge_stages (
  id uuid primary key default gen_random_uuid(),
  stage_number int not null unique,
  name text not null,
  description text not null,
  created_at timestamptz not null default now()
);

-- ── Concierge Tasks (seed table) ───────────────────────────────────────────

create table concierge_tasks (
  id uuid primary key default gen_random_uuid(),
  stage_id uuid not null references concierge_stages(id) on delete cascade,
  title text not null,
  description text not null,
  action_type action_type not null default 'mark_done',
  action_url text,
  domain_id uuid references compliance_domains(id),
  display_order int not null default 0,
  applies_to jsonb not null default '{}',
  created_at timestamptz not null default now()
);

-- ── User Concierge Progress ────────────────────────────────────────────────

create table user_concierge_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  task_id uuid not null references concierge_tasks(id) on delete cascade,
  completed boolean not null default false,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (user_id, task_id)
);

-- ── Task Calendar ──────────────────────────────────────────────────────────

create table task_calendar (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  task_type task_type not null default 'compliance_action',
  due_date date not null,
  completed boolean not null default false,
  completed_at timestamptz,
  domain_id uuid references compliance_domains(id),
  source text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── Documents ──────────────────────────────────────────────────────────────

create table documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  file_name text not null,
  file_path text not null,
  file_type text not null,
  file_size int not null,
  category document_category not null default 'formation',
  expiry_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── Advisor Conversations ──────────────────────────────────────────────────

create table advisor_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table advisor_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references advisor_conversations(id) on delete cascade,
  role message_role not null,
  content text not null,
  confidence health_status,
  created_at timestamptz not null default now()
);

-- ── Subscriptions ──────────────────────────────────────────────────────────

create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text,
  plan_type plan_type,
  status subscription_status not null default 'trialing',
  trial_ends_at timestamptz,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id)
);

-- ── Notification Preferences ───────────────────────────────────────────────

create table notification_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  email_statutory boolean not null default true,
  email_compliance boolean not null default true,
  push_enabled boolean not null default false,
  weekly_digest boolean not null default true,
  monthly_digest boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id)
);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

alter table business_profiles enable row level security;
alter table compliance_domains enable row level security;
alter table compliance_domain_scores enable row level security;
alter table health_scores enable row level security;
alter table concierge_stages enable row level security;
alter table concierge_tasks enable row level security;
alter table user_concierge_progress enable row level security;
alter table task_calendar enable row level security;
alter table documents enable row level security;
alter table advisor_conversations enable row level security;
alter table advisor_messages enable row level security;
alter table subscriptions enable row level security;
alter table notification_preferences enable row level security;

-- ── User-owned tables ──────────────────────────────────────────────────────

create policy "Users can view own profile" on business_profiles for select using (auth.uid() = user_id);
create policy "Users can insert own profile" on business_profiles for insert with check (auth.uid() = user_id);
create policy "Users can update own profile" on business_profiles for update using (auth.uid() = user_id);

create policy "Users can view own domain scores" on compliance_domain_scores for select using (auth.uid() = user_id);
create policy "Users can insert own domain scores" on compliance_domain_scores for insert with check (auth.uid() = user_id);
create policy "Users can update own domain scores" on compliance_domain_scores for update using (auth.uid() = user_id);

create policy "Users can view own health score" on health_scores for select using (auth.uid() = user_id);
create policy "Users can insert own health score" on health_scores for insert with check (auth.uid() = user_id);
create policy "Users can update own health score" on health_scores for update using (auth.uid() = user_id);

create policy "Users can view own concierge progress" on user_concierge_progress for select using (auth.uid() = user_id);
create policy "Users can insert own concierge progress" on user_concierge_progress for insert with check (auth.uid() = user_id);
create policy "Users can update own concierge progress" on user_concierge_progress for update using (auth.uid() = user_id);

create policy "Users can view own calendar tasks" on task_calendar for select using (auth.uid() = user_id);
create policy "Users can insert own calendar tasks" on task_calendar for insert with check (auth.uid() = user_id);
create policy "Users can update own calendar tasks" on task_calendar for update using (auth.uid() = user_id);
create policy "Users can delete own calendar tasks" on task_calendar for delete using (auth.uid() = user_id);

create policy "Users can view own documents" on documents for select using (auth.uid() = user_id);
create policy "Users can insert own documents" on documents for insert with check (auth.uid() = user_id);
create policy "Users can update own documents" on documents for update using (auth.uid() = user_id);
create policy "Users can delete own documents" on documents for delete using (auth.uid() = user_id);

create policy "Users can view own conversations" on advisor_conversations for select using (auth.uid() = user_id);
create policy "Users can insert own conversations" on advisor_conversations for insert with check (auth.uid() = user_id);
create policy "Users can update own conversations" on advisor_conversations for update using (auth.uid() = user_id);

create policy "Users can view own messages" on advisor_messages for select using (
  exists (select 1 from advisor_conversations where id = advisor_messages.conversation_id and user_id = auth.uid())
);
create policy "Users can insert own messages" on advisor_messages for insert with check (
  exists (select 1 from advisor_conversations where id = advisor_messages.conversation_id and user_id = auth.uid())
);

create policy "Users can view own subscription" on subscriptions for select using (auth.uid() = user_id);
create policy "Users can insert own subscription" on subscriptions for insert with check (auth.uid() = user_id);
create policy "Users can update own subscription" on subscriptions for update using (auth.uid() = user_id);

create policy "Users can view own notification prefs" on notification_preferences for select using (auth.uid() = user_id);
create policy "Users can insert own notification prefs" on notification_preferences for insert with check (auth.uid() = user_id);
create policy "Users can update own notification prefs" on notification_preferences for update using (auth.uid() = user_id);

-- ── Seed tables: public read ───────────────────────────────────────────────

create policy "Anyone can view compliance domains" on compliance_domains for select using (true);
create policy "Anyone can view concierge stages" on concierge_stages for select using (true);
create policy "Anyone can view concierge tasks" on concierge_tasks for select using (true);

-- ============================================================================
-- SEED DATA
-- ============================================================================

insert into compliance_domains (name, description, display_order) values
  ('Formation & Registration', 'HMRC registration, Companies House filings, ICO registration', 1),
  ('Tax & Financial', 'VAT returns, payroll RTI, annual accounts, Self Assessment', 2),
  ('Data Protection', 'ICO renewal, privacy policy, GDPR obligations', 3),
  ('Health & Safety', 'H&S policy, risk assessments, fire risk, DSE', 4),
  ('Employment & People', 'Contracts, right to work, auto-enrolment, NMW', 5),
  ('Insurance', 'Employer''s liability, public liability, professional indemnity', 6);

insert into concierge_stages (stage_number, name, description) values
  (1, 'Register & Exist', 'Make sure your business is properly registered and recognised by the right authorities.'),
  (2, 'Operate Safely', 'Set up the protections and policies you need to run your business safely and legally.'),
  (3, 'Build Good Habits', 'Create the routines that keep you compliant without having to think about it.');

-- ============================================================================
-- INDEXES
-- ============================================================================

create index idx_business_profiles_user on business_profiles(user_id);
create index idx_domain_scores_user on compliance_domain_scores(user_id);
create index idx_health_scores_user on health_scores(user_id);
create index idx_concierge_progress_user on user_concierge_progress(user_id);
create index idx_task_calendar_user on task_calendar(user_id);
create index idx_task_calendar_due_date on task_calendar(user_id, due_date);
create index idx_documents_user on documents(user_id);
create index idx_documents_category on documents(user_id, category);
create index idx_advisor_conversations_user on advisor_conversations(user_id);
create index idx_advisor_messages_conversation on advisor_messages(conversation_id);
create index idx_subscriptions_user on subscriptions(user_id);
create index idx_subscriptions_stripe on subscriptions(stripe_customer_id);

-- ── Updated_at trigger function ────────────────────────────────────────────

create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_business_profiles_updated before update on business_profiles for each row execute function update_updated_at();
create trigger trg_domain_scores_updated before update on compliance_domain_scores for each row execute function update_updated_at();
create trigger trg_task_calendar_updated before update on task_calendar for each row execute function update_updated_at();
create trigger trg_documents_updated before update on documents for each row execute function update_updated_at();
create trigger trg_advisor_conversations_updated before update on advisor_conversations for each row execute function update_updated_at();
create trigger trg_subscriptions_updated before update on subscriptions for each row execute function update_updated_at();
create trigger trg_notification_prefs_updated before update on notification_preferences for each row execute function update_updated_at();
