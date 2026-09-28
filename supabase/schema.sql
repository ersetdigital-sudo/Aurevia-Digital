-- Skema database Aurevia Digital (admin dashboard + situs dinamis)
-- Jalankan di SQL Editor Supabase atau lewat Management API.

-- =========================================================
-- 1. Kategori layanan
--    slug dipakai sebagai id kategori di checkout situs publik,
--    lengkap dengan label field form & biaya admin per kategori.
-- =========================================================
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  icon text not null default 'card',
  tile_class text not null default 'bg-[#EFF6FF] text-[#2563EB]',
  description text not null default '',
  nominal_title text not null default 'Pilih Layanan',
  field_label text not null default 'Nomor Tujuan',
  field_placeholder text not null default '',
  field_hint text not null default '',
  admin_fee bigint not null default 0,
  sort int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- =========================================================
-- 2. Produk / item layanan
-- =========================================================
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories (id) on delete cascade,
  name text not null,
  detail text not null default '',
  price bigint not null default 0,
  variable boolean not null default false, -- harga mengikuti tagihan (mis. multifinance)
  group_name text not null default '',        -- tab kelompok di checkout, mis. "Telkomsel"
  image_url text,
  sort int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists products_category_idx on public.products (category_id, sort);

-- =========================================================
-- 2b. Kolom tambahan untuk database yang sudah pernah dibuat
--     (aman dijalankan berulang kali)
-- =========================================================
alter table public.categories add column if not exists nominal_title text not null default 'Pilih Layanan';
alter table public.categories add column if not exists field_label text not null default 'Nomor Tujuan';
alter table public.categories add column if not exists field_placeholder text not null default '';
alter table public.categories add column if not exists field_hint text not null default '';
alter table public.categories add column if not exists admin_fee bigint not null default 0;
alter table public.products add column if not exists group_name text not null default '';

-- =========================================================
-- 3. Pesanan (dari checkout situs)
-- =========================================================
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  ref text not null unique,
  category text not null default '',
  category_id uuid references public.categories (id) on delete set null,
  product text not null default '',
  target text not null default '',
  amount bigint not null default 0,
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'processing', 'success', 'failed', 'refunded')),
  payment_method text not null default 'QRIS',
  invoice_no text,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists orders_status_idx on public.orders (status);

create or replace function public.touch_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists orders_touch on public.orders;
create trigger orders_touch before update on public.orders
for each row execute function public.touch_updated_at();

-- =========================================================
-- 4. Pesan / kontak dari pengunjung
-- =========================================================
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact text not null default '',
  subject text not null default '',
  body text not null,
  status text not null default 'new' check (status in ('new', 'read', 'replied')),
  created_at timestamptz not null default now()
);

create index if not exists messages_created_at_idx on public.messages (created_at desc);

-- =========================================================
-- 5. Pengaturan situs (foto QRIS, banner, info kontak, dll)
-- =========================================================
create table if not exists public.settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

insert into public.settings (key, value) values
  ('qris', '{"image_url": "", "merchant": "AUREVIA DIGITAL", "note": "Tampilan QRIS contoh — ganti dengan QRIS asli lewat menu Pengaturan."}'),
  ('site', '{"announcement": "", "wa": "", "email": ""}')
on conflict (key) do nothing;

-- =========================================================
-- 6. Row Level Security
--    Publik hanya boleh MEMBACA kategori/produk aktif & pengaturan.
--    Pesanan + pesan hanya lewat API server (service role).
-- =========================================================
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.messages enable row level security;
alter table public.settings enable row level security;

drop policy if exists "public read categories" on public.categories;
create policy "public read categories" on public.categories
for select using (active = true);

drop policy if exists "public read active products" on public.products;
create policy "public read active products" on public.products
for select using (active = true);

drop policy if exists "public read settings" on public.settings;
create policy "public read settings" on public.settings
for select using (true);
