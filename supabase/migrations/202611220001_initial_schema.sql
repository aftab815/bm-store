create extension if not exists pgcrypto;

create type order_status as enum (
  'pending','verification_required','confirmed','processing','packed','shipped','delivered','cancelled','returned'
);
create type payment_status as enum ('unpaid','paid','refunded');
create type product_status as enum ('draft','published','archived');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'admin' check (role in ('admin','super_admin')),
  created_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  banner_url text,
  parent_id uuid references public.categories(id),
  sort_order integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  slug text not null unique,
  sku text unique,
  subcategory text,
  short_description text,
  description text,
  material text,
  features jsonb not null default '[]'::jsonb,
  regular_price integer not null check (regular_price >= 0),
  sale_price integer check (sale_price is null or sale_price >= 0),
  status product_status not null default 'draft',
  is_featured boolean not null default false,
  is_new_arrival boolean not null default false,
  is_best_seller boolean not null default false,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  sku text unique,
  size text,
  color text,
  regular_price integer,
  sale_price integer,
  is_active boolean not null default true,
  unique (product_id, size, color)
);

create table public.product_inventory (
  variant_id uuid primary key references public.product_variants(id) on delete cascade,
  quantity integer not null default 0 check (quantity >= 0),
  updated_at timestamptz not null default now()
);

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  variant_id uuid references public.product_variants(id) on delete set null,
  storage_path text not null,
  public_url text not null,
  alt_text text,
  sort_order integer not null default 0,
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.customers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  email text not null,
  phone text,
  full_name text,
  created_at timestamptz not null default now(),
  unique (email)
);

create table public.addresses (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  label text,
  full_name text not null,
  phone text not null,
  line1 text not null,
  city text not null,
  region text,
  postal_code text,
  country text not null,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  idempotency_key text unique,
  customer_id uuid not null references public.customers(id),
  address_id uuid not null references public.addresses(id),
  status order_status not null default 'pending',
  payment_method text not null default 'cash_on_delivery',
  payment_status payment_status not null default 'unpaid',
  subtotal integer not null check (subtotal >= 0),
  shipping_charges integer not null default 0 check (shipping_charges >= 0),
  total integer not null check (total >= 0),
  internal_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id),
  variant_id uuid references public.product_variants(id),
  product_name text not null,
  sku text,
  size text,
  color text,
  unit_price integer not null check (unit_price >= 0),
  quantity integer not null check (quantity > 0),
  line_total integer not null check (line_total >= 0)
);

create table public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  discount_type text not null check (discount_type in ('fixed','percent')),
  discount_value integer not null check (discount_value > 0),
  minimum_subtotal integer not null default 0,
  is_active boolean not null default true,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.banners (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  heading text,
  description text,
  button_text text,
  button_destination text,
  is_enabled boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.store_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id),
  action text not null,
  entity_type text not null,
  entity_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index products_category_status_idx on public.products(category_id,status);
create index products_new_featured_best_idx on public.products(is_new_arrival,is_featured,is_best_seller);
create index variants_product_idx on public.product_variants(product_id);
create index images_product_variant_idx on public.product_images(product_id,variant_id,sort_order);
create index orders_status_created_idx on public.orders(status,created_at desc);
create index orders_customer_idx on public.orders(customer_id);

insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values (
  'product-images','product-images',true,5242880,
  array['image/jpeg','image/png','image/webp','image/avif']
) on conflict (id) do update set public = true, file_size_limit = 5242880;
