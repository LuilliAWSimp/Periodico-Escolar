create extension if not exists pgcrypto;

create table if not exists public.articles (
  id text primary key,
  section text not null check (section in ('escolar', 'english')),
  title text not null,
  summary text not null,
  content text not null,
  image_url text,
  category text,
  author text,
  display_date text,
  featured boolean not null default false,
  image_fit text default 'cover',
  image_position text default 'center center',
  image_height integer default 320,
  external_url text,
  mirrored_from_school_id text,
  mirrored_from_english_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id text primary key,
  top_meta text,
  kicker text,
  title text,
  subtitle text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_articles_updated_at on public.articles;
create trigger trg_articles_updated_at
before update on public.articles
for each row
execute function public.set_updated_at();

drop trigger if exists trg_site_settings_updated_at on public.site_settings;
create trigger trg_site_settings_updated_at
before update on public.site_settings
for each row
execute function public.set_updated_at();

alter table public.articles enable row level security;
alter table public.site_settings enable row level security;

drop policy if exists "public read articles" on public.articles;
create policy "public read articles"
on public.articles for select
using (true);

drop policy if exists "public write articles" on public.articles;
create policy "public write articles"
on public.articles for all
using (true)
with check (true);

drop policy if exists "public read site settings" on public.site_settings;
create policy "public read site settings"
on public.site_settings for select
using (true);

drop policy if exists "public write site settings" on public.site_settings;
create policy "public write site settings"
on public.site_settings for all
using (true)
with check (true);

insert into public.site_settings (id, top_meta, kicker, title, subtitle)
values (
  'main',
  'Edición digital escolar',
  'Comunidad • Escuela • Cultura • Actualidad',
  'El Faro Escolar',
  'Un periódico escolar digital con mirada local, nacional e internacional'
)
on conflict (id) do nothing;

-- Bucket opcional para imágenes:
-- insert into storage.buckets (id, name, public)
-- values ('news-images', 'news-images', true)
-- on conflict (id) do nothing;

-- Políticas opcionales para storage.objects:
-- create policy "public read storage"
-- on storage.objects for select
-- using (bucket_id = 'news-images');

-- create policy "public write storage"
-- on storage.objects for insert
-- with check (bucket_id = 'news-images');

-- create policy "public update storage"
-- on storage.objects for update
-- using (bucket_id = 'news-images')
-- with check (bucket_id = 'news-images');

-- create policy "public delete storage"
-- on storage.objects for delete
-- using (bucket_id = 'news-images');