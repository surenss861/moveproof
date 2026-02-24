-- MoveProof: extend entitlements for Vault subscription lifecycle

alter table public.entitlements
  add column if not exists status text not null default 'active',
  add column if not exists interval text,                  -- 'month' | 'year' | null (one-time)
  add column if not exists stripe_price_id text,
  add column if not exists current_period_end timestamptz,
  add column if not exists cancel_at_period_end boolean not null default false,
  add column if not exists customer_email text;

-- Fast lookup by subscription ID (used by webhook for updates/deletes)
create index if not exists entitlements_sub_id
  on public.entitlements(stripe_subscription_id)
  where stripe_subscription_id is not null;
