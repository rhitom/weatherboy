# Weatherboy

A personalized weather dashboard for MPCS databases course. The system uses a background worker to poll live APIs, writes normalized data to Supabase, and serves a Next.js frontend that updates through Supabase Realtime. Classmates must be able to sign up and use it. The project should also remain useful as a portfolio piece after the class ends.

## Current Status

- Prototype dashboard exists in `apps/web` with hardcoded data and the intended visual language.
- Full-stack implementation is now in progress and the main app shell is built.
- Current implementation focus: local end-to-end verification, deployment prep, and hosted setup.
- Active working copy lives outside OneDrive to avoid Windows file-lock issues during builds.
- Current source of truth: `C:\Users\rhito\weatherboy-local-20260420-223208`.
- OneDrive copy should not be used for local auth/runtime testing because it does not carry the working local env files.

## TODOs

- [ ] Moon phase spiritual blurbs: write 8 short blurbs, one for each major moon phase.
- [ ] Weekly synopsis friendly-tone templates: finish the deterministic template library for the forecast summary.
- [ ] Guest preview decision: revisit whether the landing page should offer a non-authenticated guest preview after the core flow is complete.
- [ ] Verify the live Clerk sign-up/sign-in flow in the local copy after starting the web app from `C:\Users\rhito\weatherboy-local-20260420-223208`.
- [ ] Test onboarding against the live Supabase project and confirm `cities`, `user_preferences`, and `user_favorite_cities` populate correctly.
- [ ] Run the worker manually with live credentials and verify writes into `weather_current`, `weather_forecast`, `air_quality`, `astronomy`, and `horoscopes`.
- [ ] Decide whether to keep pollen deferred for the class submission or return to Google Pollen setup after the core path is verified.
- [ ] If pollen is restored, add `GOOGLE_POLLEN_API_KEY` and verify writes into `pollen`.
- [ ] Verify the dashboard switches from prototype fallback to real Supabase-backed data for an onboarded user.
- [ ] Verify Realtime refresh works when weather-facing tables change.
- [ ] Finish settings polish and confirm edits round-trip into Supabase and back onto the dashboard.
- [ ] Add deterministic synopsis text and moon-phase blurbs to the live dashboard path.
- [ ] Confirm Supabase Realtime is enabled on all required tables in the hosted project.
- [ ] Configure Railway cron for the worker's daily run.
- [ ] Deploy the web app to Vercel.
- [ ] Deploy the worker to Railway.
- [ ] Add hosted environment variables in Vercel and Railway dashboards.
- [ ] Configure the Supabase MCP server for the assignment requirement.
- [ ] Make multiple git commits that show implementation progress from scaffold to live integration.
- [ ] Run the full end-to-end checklist with a real account and at least one classmate test.

## Locked Decisions

- Keep the current dashboard visual design for v1.
- Require onboarding before users can access the dashboard.
- Limit city search and city support to US cities.
- Poll only cities that are actively referenced by users.
- Run the worker once per day.
- Keep astrology in v1.
- Ask for astrology opt-in during onboarding.
- If astrology is enabled, ask for birthday and derive zodiac sign from it.
- Allow up to 4 favorite cities and provide a clear "skip for now" path.
- Keep home base and favorites separate.
- Hide optional sections such as horoscope and pollen until data exists.
- Keep the landing page minimal, typographic, and general rather than making it a pitch page.
- Landing page headline: `a softer way to start the day`
- Landing page branding: tiny pixel cloud with a moon and north star, also reused as the favicon and app icon.
- Landing page color palette: `#FFE7FF`, `#f8f8ff`, `#edf4ff`, `#d8e5ff`, `#dee2ff`, with `#f8f8ff` used most heavily.
- Weekly synopsis generation should stay deterministic rather than using an LLM.

## Completed

- [x] Dashboard prototype with hardcoded data
- [x] Design language established: glass cards, time-of-day gradients, Cormorant Garamond plus Inter
- [x] API stack selected
- [x] Pollen API selected: Google Pollen API
- [x] Architecture plan written
- [x] Monorepo workspace root and shared package scaffolded
- [x] Landing page, sign-in, sign-up, onboarding, dashboard, and settings route shell scaffolded
- [x] Supabase SQL schema and setup notes added
- [x] Supabase CLI installed locally and `supabase init` completed in the local repo
- [x] Supabase CLI authenticated locally
- [x] Real Supabase project created for `weatherboy` and linked to the local repo
- [x] `supabase db push` applied `supabase/migrations/20260420_initial_schema.sql` to the remote project
- [x] Local `apps/web/.env.local` and `apps/worker/.env.local` populated with Supabase URL and keys
- [x] Real Clerk project keys added to `apps/web/.env.local`
- [x] Real WeatherAPI key added to `apps/worker/.env.local` and verified with a direct astronomy request
- [x] Worker sync scaffold added for weather, air quality, astronomy, pollen, and horoscopes
- [x] Local non-OneDrive working copy verified with successful web production build and worker build
- [x] Dashboard data helper added with Supabase-backed reads and prototype fallback
- [x] Dashboard now respects saved data-point visibility and hides optional sections when data is missing
- [x] Editable settings flow added and wired to the same preference persistence path as onboarding
- [x] Supabase Realtime dashboard refresh layer added
- [x] Local web lint and production builds verified after the settings and Realtime work
- [x] Root cause of the broken local sign-up test identified: app was being opened from the stale OneDrive copy instead of the working local repo

## Remaining Implementation Plan

### Phase 1: Foundation
1. Create the workspace root and monorepo package structure.
2. Scaffold `apps/worker`.
3. Add shared TypeScript types for frontend and worker.
4. Add environment variable examples for web and worker.

### Phase 2: Backend Contract
5. Create Supabase project and schema.
6. Enable Realtime for weather-facing tables.
7. Add RLS policies for user-owned preferences and authenticated reads.
8. Add typed Supabase access utilities in the web app and worker.

### Phase 3: Auth and Routing
9. Create Clerk project.
10. Add Clerk to the Next.js app, including provider, middleware, and sign-in/sign-up pages.
11. Implement gated routing between landing page, onboarding, dashboard, and settings.

### Phase 4: Onboarding
12. Build home city selection using US-only Open-Meteo geocoding.
13. Build favorite city selection with up to 4 cities and a "skip for now" option.
14. Build temperature preference, visible data point, and units steps.
15. Add astrology opt-in and conditional birthday capture.
16. Persist `user_preferences` and `user_favorite_cities`.

### Phase 5: Worker
17. Implement worker sync for Open-Meteo weather and air quality.
18. Implement worker sync for WeatherAPI astronomy, Google Pollen, and Aztro horoscopes.
19. Upsert all API results into Supabase.
20. Configure Railway daily cron execution.

### Phase 6: Live Dashboard
21. Replace hardcoded dashboard data with Supabase-backed reads.
22. Add hot/cold personalization and deterministic clothing/synopsis generation.
23. Add dynamic favorite city tile layout based on the number of selected favorites.
24. Hide optional cards until backing data exists.

### Phase 7: Realtime and Settings
25. Add Supabase Realtime subscriptions for current weather-facing data.
26. Build settings page for preferences, city edits, units, and astrology updates.

### Phase 8: Deploy and Verify
27. Deploy web to Vercel.
28. Deploy worker to Railway.
29. Verify env vars in local and hosted environments.
30. Run end-to-end tests with a real signup and onboarding flow.

## Next Session Starting Point

- The active repo copy is `C:\Users\rhito\weatherboy-local-20260420-223208`.
- The live Supabase project is `weatherboy` with project ref `ljlkzuljrikahklqltgb`.
- Clerk keys are already present in `apps/web/.env.local` in the local copy.
- Supabase URL, anon key, and service-role key are already present in the local env files.
- `WEATHERAPI_KEY` is already present and verified in `apps/worker/.env.local`.
- `GOOGLE_POLLEN_API_KEY` is intentionally still blank for now.
- This local copy now passes:
  - `npm run build --workspace @weatherboy/worker`
  - `npm run lint --workspace @weatherboy/web`
  - `npm run build --workspace @weatherboy/web`
- For local testing, start the app from this folder only:
  - `cd C:\Users\rhito\weatherboy-local-20260420-223208`
  - `npm run dev --workspace @weatherboy/web`
- The biggest remaining work is no longer app scaffolding. It is end-to-end integration and deployment:
  - live auth/onboarding verification
  - worker-to-Supabase verification
  - realtime verification
  - deployment

## Architecture

### Tech Stack

- Frontend: Next.js 16 (App Router) + Tailwind CSS v4, deployed on Vercel
- Worker: Node.js scheduled job, deployed on Railway
- Database: Supabase (Postgres + Realtime)
- Auth: Clerk
- APIs: Open-Meteo, WeatherAPI.com, Google Pollen, Aztro

### Data Sources

| Data Point | API | Key Required | Cost |
|---|---|---|---|
| Temperature, feels-like, humidity, precipitation, wind | Open-Meteo Forecast | No | Free |
| Air quality (US AQI, PM2.5, PM10) | Open-Meteo Air Quality | No | Free |
| Sunrise, sunset, moonrise, moonset, moon phase | WeatherAPI Astronomy | Yes | Free tier |
| Pollen (grass, tree, weed) | Google Pollen API | Yes | Free tier |
| Daily horoscope | Aztro API | No | Free |
| City geocoding | Open-Meteo Geocoding | No | Free |

### Data Flow

```text
APIs (Open-Meteo, WeatherAPI, Google Pollen, Aztro)
  -> daily worker sync
Worker (Railway)
  -> upserts
Supabase
  -> reads + realtime subscriptions
Frontend (Vercel / Next.js)
  <- auth identity
Clerk
```

### Monorepo Structure

```text
weatherboy/
|-- CLAUDE.md
|-- package.json
|-- apps/
|   |-- web/
|   `-- worker/
`-- packages/
    `-- shared/
```

### Database Schema

Tables:

- `cities`: id, name, slug, state_code, latitude, longitude, timezone, country_code
- `user_preferences`: clerk_user_id, home_city_id, runs_hot_or_cold, units_temp, units_wind, selected_data_points, astrology_enabled, birthday, zodiac_sign, onboarding_complete
- `user_favorite_cities`: clerk_user_id, city_id, position
- `weather_current`: city_id, observed_at, temperature_c, feels_like_c, humidity, precipitation_mm, wind_speed_kmh, wind_direction_deg, weather_code
- `weather_forecast`: city_id, forecast_date, temp_max_c, temp_min_c, precipitation_sum_mm, precipitation_probability, weather_code
- `air_quality`: city_id, observed_at, us_aqi, pm2_5, pm10
- `pollen`: city_id, observed_at, grass_index, grass_risk, tree_index, tree_risk, weed_index, weed_risk
- `astronomy`: city_id, observed_on, sunrise, sunset, moonrise, moonset, moon_phase, moon_illumination
- `horoscopes`: zodiac_sign, horoscope_date, description, mood, lucky_number, lucky_color, compatibility

Realtime-enabled tables:

- `weather_current`
- `weather_forecast`
- `air_quality`
- `pollen`
- `astronomy`
- `horoscopes`

RLS rules:

- Users can read and write only their own rows in `user_preferences` and `user_favorite_cities`.
- Authenticated users can read shared weather data.
- Service-role worker writes all shared weather data.

## Environment Variables

### `apps/web/.env.local`

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

### `apps/worker/.env.local`

```bash
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
WEATHERAPI_KEY=
GOOGLE_POLLEN_API_KEY=
```

## Design Decisions

- Layout: home base takes the primary column, favorites occupy a secondary column and adapt to the number of selected cities.
- Glass cards: very light, soft cards with a high `#f8f8ff` presence and subtle blur.
- Gradient background: time-of-day-based gradients with a lighter, more refreshing palette.
- Typography: Cormorant Garamond italic for titles, Inter for supporting text, mostly lowercase.
- Landing page tone: soft, poetic, and minimal.
- Dashboard tone: clear, calm, and personal rather than playful or novelty-heavy.

## Assignment Requirements Checklist

- [ ] Monorepo with `apps/web` and `apps/worker`
- [x] Built with Next.js + Tailwind CSS
- [ ] Background worker deployed on Railway
- [x] Data stored in Supabase
- [ ] Supabase Realtime live updates
- [x] User authentication via Clerk
- [x] Personalization via favorites and preferences
- [ ] Environment variables configured locally and in hosted platforms
- [ ] Supabase MCP server configured
- [x] `CLAUDE.md` describing architecture
- [ ] Multiple git commits showing iteration
- [ ] Deployed to Vercel and Railway
- [ ] Live URLs work for classmate signup

## Testing Checklist

- [ ] Sign up with a new Clerk account
- [ ] Complete onboarding
- [ ] Verify home base and favorites appear on the dashboard
- [ ] Run worker manually and confirm Supabase tables populate
- [ ] Confirm realtime dashboard updates without page refresh
- [ ] Toggle visible data points and verify dashboard changes
- [ ] Enable astrology, add birthday, and verify horoscope card appears
- [ ] Test with a classmate account
- [ ] Verify deployed URLs work end to end
