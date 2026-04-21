import type { GeocodedCity, OnboardingSubmission } from "@weatherboy/shared";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getZodiacSignFromBirthday } from "@/lib/zodiac";

export function createCitySlug(city: GeocodedCity) {
  const safeName = city.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const safeState = city.stateCode.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return `${safeName}-${safeState}-${city.latitude.toFixed(3)}-${city.longitude.toFixed(3)}`;
}

export async function upsertCity(
  supabase: NonNullable<ReturnType<typeof createSupabaseAdminClient>>,
  city: GeocodedCity,
) {
  const { data, error } = await supabase
    .from("cities")
    .upsert(
      {
        name: city.name,
        slug: createCitySlug(city),
        state_code: city.stateCode,
        latitude: city.latitude,
        longitude: city.longitude,
        timezone: city.timezone,
        country_code: city.countryCode,
      },
      { onConflict: "latitude,longitude" },
    )
    .select("id")
    .single();

  if (error || !data) {
    throw new Error("Could not save selected city.");
  }

  return data.id as string;
}

export async function persistUserPreferences(
  supabase: NonNullable<ReturnType<typeof createSupabaseAdminClient>>,
  userId: string,
  submission: OnboardingSubmission,
  onboardingComplete: boolean,
) {
  if (!submission.homeCity) {
    throw new Error("Please choose a home city.");
  }

  if (submission.selectedDataPoints.length === 0) {
    throw new Error("Select at least one data point for the dashboard.");
  }

  if (submission.favoriteCities.length > 4) {
    throw new Error("Pick at most four favorite cities.");
  }

  if (submission.astrologyEnabled && !submission.birthday) {
    throw new Error("Add a birthday if you want astrology turned on.");
  }

  const homeCityId = await upsertCity(supabase, submission.homeCity);
  const favoriteCityIds = await Promise.all(
    submission.favoriteCities.map((city) => upsertCity(supabase, city)),
  );

  const zodiacSign =
    submission.astrologyEnabled && submission.birthday
      ? getZodiacSignFromBirthday(submission.birthday)
      : null;

  await supabase.from("user_preferences").upsert(
    {
      clerk_user_id: userId,
      home_city_id: homeCityId,
      runs_hot_or_cold: submission.runsHotOrCold,
      units_temp: submission.unitsTemp,
      units_wind: submission.unitsWind,
      selected_data_points: submission.selectedDataPoints,
      astrology_enabled: submission.astrologyEnabled,
      birthday: submission.astrologyEnabled ? submission.birthday : null,
      zodiac_sign: zodiacSign,
      onboarding_complete: onboardingComplete,
    },
    { onConflict: "clerk_user_id" },
  );

  await supabase.from("user_favorite_cities").delete().eq("clerk_user_id", userId);

  if (favoriteCityIds.length > 0) {
    await supabase.from("user_favorite_cities").insert(
      favoriteCityIds.map((cityId, index) => ({
        clerk_user_id: userId,
        city_id: cityId,
        position: index + 1,
      })),
    );
  }
}
