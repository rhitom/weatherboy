import type { GeocodedCity, OnboardingSubmission } from "@weatherboy/shared";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export type SettingsData = {
  initialForm: OnboardingSubmission;
  homeCity: string;
  favoriteCities: string[];
  runsHotOrCold: string;
  unitsTemp: string;
  unitsWind: string;
  selectedDataPoints: string[];
  astrologyEnabled: boolean;
  birthday: string | null;
  zodiacSign: string | null;
  usingSavedSettings: boolean;
};

export const prototypeSettingsData: SettingsData = {
  initialForm: {
    homeCity: {
      name: "Chicago",
      stateCode: "Illinois",
      countryCode: "US",
      latitude: 41.8781,
      longitude: -87.6298,
      timezone: "America/Chicago",
    },
    favoriteCities: [
      { name: "New York", stateCode: "New York", countryCode: "US", latitude: 40.7128, longitude: -74.006, timezone: "America/New_York" },
      { name: "San Francisco", stateCode: "California", countryCode: "US", latitude: 37.7749, longitude: -122.4194, timezone: "America/Los_Angeles" },
      { name: "Miami", stateCode: "Florida", countryCode: "US", latitude: 25.7617, longitude: -80.1918, timezone: "America/New_York" },
      { name: "Seattle", stateCode: "Washington", countryCode: "US", latitude: 47.6062, longitude: -122.3321, timezone: "America/Los_Angeles" },
    ],
    runsHotOrCold: "neutral",
    selectedDataPoints: ["humidity", "precipitation", "wind", "airQuality", "pollenTree", "pollenGrass"],
    unitsTemp: "f",
    unitsWind: "mph",
    astrologyEnabled: true,
    birthday: null,
  },
  homeCity: "Chicago, Illinois",
  favoriteCities: ["New York, New York", "San Francisco, California", "Miami, Florida", "Seattle, Washington"],
  runsHotOrCold: "neutral",
  unitsTemp: "fahrenheit",
  unitsWind: "mph",
  selectedDataPoints: ["humidity", "precipitation", "wind", "air quality", "tree pollen", "grass pollen"],
  astrologyEnabled: true,
  birthday: null,
  zodiacSign: "Taurus",
  usingSavedSettings: false,
};

function formatCity(city: { name?: string | null; state_code?: string | null } | null) {
  if (!city?.name) return "Not set";
  return city.state_code ? `${city.name}, ${city.state_code}` : city.name;
}

function toGeocodedCity(city: {
  name: string;
  state_code: string;
  country_code?: string | null;
  latitude: number;
  longitude: number;
  timezone: string;
}): GeocodedCity {
  return {
    name: city.name,
    stateCode: city.state_code,
    countryCode: "US",
    latitude: city.latitude,
    longitude: city.longitude,
    timezone: city.timezone,
  };
}

export async function getSettingsData(userId: string | null): Promise<SettingsData> {
  if (!userId) {
    return prototypeSettingsData;
  }

  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return prototypeSettingsData;
  }

  const { data: preferences } = await supabase
    .from("user_preferences")
    .select("*")
    .eq("clerk_user_id", userId)
    .maybeSingle();

  if (!preferences) {
    return prototypeSettingsData;
  }

  const favoriteRelations = await supabase
    .from("user_favorite_cities")
    .select("city_id, position")
    .eq("clerk_user_id", userId)
    .order("position", { ascending: true });

  const cityIds = [
    preferences.home_city_id,
    ...(favoriteRelations.data ?? []).map((row) => row.city_id),
  ].filter(Boolean);

  const { data: cityRows } = cityIds.length > 0
    ? await supabase.from("cities").select("id, name, state_code, country_code, latitude, longitude, timezone").in("id", cityIds)
    : {
        data: [] as Array<{
          id: string;
          name: string;
          state_code: string;
          country_code: string;
          latitude: number;
          longitude: number;
          timezone: string;
        }>,
      };

  const cities = new Map((cityRows ?? []).map((city) => [city.id, city]));
  const homeCity = cities.get(preferences.home_city_id ?? "");
  const favoriteCityRows = (favoriteRelations.data ?? [])
    .map((row) => cities.get(row.city_id))
    .filter((city): city is NonNullable<typeof city> => Boolean(city));

  return {
    initialForm: {
      homeCity: homeCity ? toGeocodedCity(homeCity) : null,
      favoriteCities: favoriteCityRows.map((city) => toGeocodedCity(city)),
      runsHotOrCold: preferences.runs_hot_or_cold ?? "neutral",
      selectedDataPoints: Array.isArray(preferences.selected_data_points) ? preferences.selected_data_points : [],
      unitsTemp: preferences.units_temp ?? "f",
      unitsWind: preferences.units_wind ?? "mph",
      astrologyEnabled: Boolean(preferences.astrology_enabled),
      birthday: preferences.birthday ?? null,
    },
    homeCity: formatCity(homeCity ?? null),
    favoriteCities: favoriteCityRows.map((city) => formatCity(city)),
    runsHotOrCold: preferences.runs_hot_or_cold ?? "neutral",
    unitsTemp: preferences.units_temp === "c" ? "celsius" : "fahrenheit",
    unitsWind: preferences.units_wind ?? "mph",
    selectedDataPoints: Array.isArray(preferences.selected_data_points)
      ? preferences.selected_data_points.map((value: string) => value.replace(/([A-Z])/g, " $1").toLowerCase())
      : [],
    astrologyEnabled: Boolean(preferences.astrology_enabled),
    birthday: preferences.birthday ?? null,
    zodiacSign: preferences.zodiac_sign ?? null,
    usingSavedSettings: true,
  };
}
