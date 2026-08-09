create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text not null default '',
  avatar_url text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_roles (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  role text not null default 'buyer' check (role in ('admin', 'seller', 'buyer')),
  created_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  icon text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.subcategories (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete cascade,
  name text not null,
  slug text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(category_id, slug)
);

create table public.businesses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null unique references public.profiles(id) on delete cascade,
  name text not null,
  slug text not null unique,
  description text,
  logo_url text,
  category_id uuid references public.categories(id) on delete set null,
  address text,
  city text,
  commune text,
  whatsapp text not null,
  instagram text,
  facebook text,
  schedule jsonb,
  latitude double precision,
  longitude double precision,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  name text not null,
  slug text not null,
  description text,
  price numeric(12,2) not null check (price >= 0),
  currency text not null default 'CLP',
  category_id uuid not null references public.categories(id),
  subcategory_id uuid references public.subcategories(id) on delete set null,
  stock integer check (stock is null or stock >= 0),
  is_unlimited_stock boolean not null default false,
  is_available boolean not null default true,
  is_featured boolean not null default false,
  status text not null default 'published' check (status in ('published', 'draft')),
  sku text,
  view_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique(business_id, slug)
);

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  url text not null,
  alt_text text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_id, product_id)
);

create table public.product_views (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  session_id text,
  created_at timestamptz not null default now()
);

create table public.whatsapp_clicks (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  business_id uuid not null references public.businesses(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  session_id text,
  created_at timestamptz not null default now()
);

create index products_search_idx on public.products using gin (to_tsvector('spanish', name || ' ' || coalesce(description, '')));
create index products_listing_idx on public.products(category_id, status, created_at desc) where deleted_at is null;
create index products_business_idx on public.products(business_id);
create index product_images_product_idx on public.product_images(product_id, sort_order);
create index favorites_user_idx on public.favorites(user_id);
create index product_views_product_idx on public.product_views(product_id, created_at desc);
create index whatsapp_clicks_business_idx on public.whatsapp_clicks(business_id, created_at desc);
