-- MoveProof: evidence-first schema
-- Run with: supabase db push (or apply via Dashboard SQL)

-- Extend auth.users with app profile (optional; we use id from auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Entitlements: plan / subscription status (Stripe webhook updates)
create table if not exists public.entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan text not null default 'free', -- free | dispute_pack | accelerator | subscription
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id)
);

-- Packs: move-in, move-out, or dispute pack
create table if not exists public.packs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('move_in', 'move_out', 'dispute')),
  address text not null,
  landlord_name text,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  pack_hash text,
  manifest_version int default 1,
  generated_at timestamptz,
  room_notes jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index packs_user_id on public.packs(user_id);
create index packs_completed_at on public.packs(completed_at) where completed_at is not null;

-- Evidence items: one per photo/file (immutable once written)
create table if not exists public.evidence_items (
  id uuid primary key default gen_random_uuid(),
  pack_id uuid not null references public.packs(id) on delete cascade,
  room text not null,
  storage_path text not null,
  sha256 text not null,
  captured_at timestamptz not null,
  uploaded_at timestamptz not null default now(),
  mime_type text,
  size_bytes bigint,
  gps jsonb, -- { lat, lng }
  note text,
  created_at timestamptz default now(),
  unique(storage_path)
);

create index evidence_items_pack_id on public.evidence_items(pack_id);

-- Manifests: canonical pack manifest + hash (for verification)
create table if not exists public.manifests (
  id uuid primary key default gen_random_uuid(),
  pack_id uuid not null references public.packs(id) on delete cascade unique,
  manifest_json jsonb not null,
  pack_hash text not null,
  generated_at timestamptz not null default now(),
  created_at timestamptz default now()
);

-- Disputes: wizard answers + letter content
create table if not exists public.disputes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  pack_id uuid references public.packs(id) on delete set null,
  outcome text not null,
  address text,
  landlord_name text,
  amount_disputed numeric(10,2),
  move_out_date date,
  province text default 'ON',
  letter_content text,
  status text default 'draft',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index disputes_user_id on public.disputes(user_id);

-- RLS
alter table public.profiles enable row level security;
alter table public.entitlements enable row level security;
alter table public.packs enable row level security;
alter table public.evidence_items enable row level security;
alter table public.manifests enable row level security;
alter table public.disputes enable row level security;

-- Profiles: own row
create policy profiles_own on public.profiles for all using (auth.uid() = id);

-- Entitlements: own row
create policy entitlements_own on public.entitlements for all using (auth.uid() = user_id);

-- Packs: own rows
create policy packs_own on public.packs for all using (auth.uid() = user_id);

-- Evidence: via pack ownership
create policy evidence_via_pack on public.evidence_items for all
  using (exists (select 1 from public.packs p where p.id = pack_id and p.user_id = auth.uid()));

-- Manifests: via pack ownership
create policy manifests_via_pack on public.manifests for all
  using (exists (select 1 from public.packs p where p.id = pack_id and p.user_id = auth.uid()));

-- Disputes: own rows
create policy disputes_own on public.disputes for all using (auth.uid() = user_id);

-- Verification: use API route with service role to return only pack_hash + evidence hashes (no user/address)

-- Storage bucket "evidence": create in Dashboard > Storage > New bucket
-- Name: evidence. For public read URLs use Public bucket; for private use Signed URLs.
-- Policy (if private): allow insert/select where (storage.foldername(name))[1] = auth.uid()::text
