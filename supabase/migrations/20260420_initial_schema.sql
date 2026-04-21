create extension if not exists "pgcrypto";

create table if not exists public.cities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  state_code text not null,
  latitude numeric(8, 5) not null,
  longitude numeric(8, 5) not null,
  timezone text not null,
  country_code text not null default 'US',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (latitude, longitude)
);

create table if not exists public.user_preferences (
  clerk_user_id text primary key,
  home_city_id uuid references public.cities(id) on delete set null,
  runs_hot_or_cold text not null check (runs_hot_or_cold in ('hot', 'neutral', 'cold')),
  units_temp text not null check (units_temp in ('f', 'c')),
  units_wind text not null check (units_wind in ('mph', 'kmh')),
  selected_data_points jsonb not null default '[]'::jsonb,
  astrology_enabled boolean not null default false,
  birthday date,
  zodiac_sign text,
  onboarding_complete boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_favorite_cities (
  clerk_user_id text not null,
  city_id uuid not null references public.cities(id) on delete cascade,
  position smallint not null check (position between 1 and 4),
  created_at timestamptz not null default now(),
  primary key (clerk_user_id, city_id),
  unique (clerk_user_id, position)
);

create table if not exists public.weather_current (
  city_id uuid primary key references public.cities(id) on delete cascade,
  observed_at timestamptz not null,
  temperature_c numeric(5, 2) not null,
  feels_like_c numeric(5, 2) not null,
  humidity integer,
  precipitation_mm numeric(6, 2),
  wind_speed_kmh numeric(6, 2),
  wind_direction_deg integer,
  weather_code integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.weather_forecast (
  city_id uuid not null references public.cities(id) on delete cascade,
  forecast_date date not null,
  temp_max_c numeric(5, 2),
  temp_min_c numeric(5, 2),
  precipitation_sum_mm numeric(6, 2),
  precipitation_probability integer,
  weather_code integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (city_id, forecast_date)
);

create table if not exists public.air_quality (
  city_id uuid primary key references public.cities(id) on delete cascade,
  observed_at timestamptz not null,
  us_aqi integer,
  pm2_5 numeric(6, 2),
  pm10 numeric(6, 2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pollen (
  city_id uuid primary key references public.cities(id) on delete cascade,
  observed_at timestamptz not null,
  grass_index integer,
  grass_risk text,
  tree_index integer,
  tree_risk text,
  weed_index integer,
  weed_risk text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.astronomy (
  city_id uuid not null references public.cities(id) on delete cascade,
  observed_on date not null,
  sunrise text,
  sunset text,
  moonrise text,
  moonset text,
  moon_phase text,
  moon_illumination integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (city_id, observed_on)
);

create table if not exists public.horoscopes (
  zodiac_sign text not null,
  horoscope_date date not null,
  description text not null,
  mood text,
  lucky_number text,
  lucky_color text,
  compatibility text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (zodiac_sign, horoscope_date)
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

drop trigger if exists cities_set_updated_at on public.cities;
create trigger cities_set_updated_at before update on public.cities for each row execute function public.set_updated_at();
drop trigger if exists user_preferences_set_updated_at on public.user_preferences;
create trigger user_preferences_set_updated_at before update on public.user_preferences for each row execute function public.set_updated_at();
drop trigger if exists weather_current_set_updated_at on public.weather_current;
create trigger weather_current_set_updated_at before update on public.weather_current for each row execute function public.set_updated_at();
drop trigger if exists weather_forecast_set_updated_at on public.weather_forecast;
create trigger weather_forecast_set_updated_at before update on public.weather_forecast for each row execute function public.set_updated_at();
drop trigger if exists air_quality_set_updated_at on public.air_quality;
create trigger air_quality_set_updated_at before update on public.air_quality for each row execute function public.set_updated_at();
drop trigger if exists pollen_set_updated_at on public.pollen;
create trigger pollen_set_updated_at before update on public.pollen for each row execute function public.set_updated_at();
drop trigger if exists astronomy_set_updated_at on public.astronomy;
create trigger astronomy_set_updated_at before update on public.astronomy for each row execute function public.set_updated_at();
drop trigger if exists horoscopes_set_updated_at on public.horoscopes;
create trigger horoscopes_set_updated_at before update on public.horoscopes for each row execute function public.set_updated_at();

alter table public.user_preferences enable row level security;
alter table public.user_favorite_cities enable row level security;
alter table public.cities enable row level security;
alter table public.weather_current enable row level security;
alter table public.weather_forecast enable row level security;
alter table public.air_quality enable row level security;
alter table public.pollen enable row level security;
alter table public.astronomy enable row level security;
alter table public.horoscopes enable row level security;

drop policy if exists "user_preferences_select_own" on public.user_preferences;
create policy "user_preferences_select_own"
on public.user_preferences
for select
to authenticated
using ((auth.jwt() ->> 'sub')::text = clerk_user_id);

drop policy if exists "user_preferences_upsert_own" on public.user_preferences;
create policy "user_preferences_upsert_own"
on public.user_preferences
for all
to authenticated
using ((auth.jwt() ->> 'sub')::text = clerk_user_id)
with check ((auth.jwt() ->> 'sub')::text = clerk_user_id);

drop policy if exists "user_favorite_cities_own" on public.user_favorite_cities;
create policy "user_favorite_cities_own"
on public.user_favorite_cities
for all
to authenticated
using ((auth.jwt() ->> 'sub')::text = clerk_user_id)
with check ((auth.jwt() ->> 'sub')::text = clerk_user_id);

drop policy if exists "cities_authenticated_read" on public.cities;
create policy "cities_authenticated_read"
on public.cities
for select
to authenticated
using (true);

drop policy if exists "weather_current_authenticated_read" on public.weather_current;
create policy "weather_current_authenticated_read"
on public.weather_current
for select
to authenticated
using (true);

drop policy if exists "weather_forecast_authenticated_read" on public.weather_forecast;
create policy "weather_forecast_authenticated_read"
on public.weather_forecast
for select
to authenticated
using (true);

drop policy if exists "air_quality_authenticated_read" on public.air_quality;
create policy "air_quality_authenticated_read"
on public.air_quality
for select
to authenticated
using (true);

drop policy if exists "pollen_authenticated_read" on public.pollen;
create policy "pollen_authenticated_read"
on public.pollen
for select
to authenticated
using (true);

drop policy if exists "astronomy_authenticated_read" on public.astronomy;
create policy "astronomy_authenticated_read"
on public.astronomy
for select
to authenticated
using (true);

drop policy if exists "horoscopes_authenticated_read" on public.horoscopes;
create policy "horoscopes_authenticated_read"
on public.horoscopes
for select
to authenticated
using (true);

alter publication supabase_realtime add table
  public.weather_current,
  public.weather_forecast,
  public.air_quality,
  public.pollen,
  public.astronomy,
  public.horoscopes;
