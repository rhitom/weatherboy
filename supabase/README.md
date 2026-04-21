# Supabase Setup

Apply the SQL in `migrations/20260420_initial_schema.sql` to a new Supabase project.

After creating the project:

1. Copy the project URL and anon key into `apps/web/.env.local`.
2. Copy the project URL and service role key into `apps/worker/.env.local`.
3. Configure Clerk JWT templates or third-party auth mapping so `auth.jwt() ->> 'sub'` resolves to the Clerk user id.
4. Confirm the realtime publication includes:
   - `weather_current`
   - `weather_forecast`
   - `air_quality`
   - `pollen`
   - `astronomy`
   - `horoscopes`
5. Test onboarding inserts:
   - `cities`
   - `user_preferences`
   - `user_favorite_cities`
