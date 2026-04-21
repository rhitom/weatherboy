import type {
  TemperaturePreference,
  TemperatureUnit,
  WeatherDataPoint,
  WindUnit,
} from "@weatherboy/shared";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type DashboardData = {
  homeBase: {
    city: string;
    region: string;
    temp: string;
    feelsLike: string;
    condition: string;
    high: string;
    low: string;
    clothingSuggestion: string;
    sunrise: string;
    sunset: string;
    sunProgress: number;
    moonrise: string;
    moonset: string;
    moonProgress: number;
    moonPhase: string;
    humidity: string;
    precipitation: string;
    precipChance: string;
    wind: string;
    windDirection: string;
    aqi: string;
    aqiLabel: string;
    pollenTree: string;
    pollenGrass: string;
    pollenWeed: string;
    visibleDataPoints: WeatherDataPoint[];
    showAstrology: boolean;
    zodiacSign: string;
    horoscope: string;
    mood: string;
    luckyNumber: string;
    luckyColor: string;
    synopsis: string;
  };
  favorites: Array<{
    city: string;
    temp: string;
    feelsLike: string;
    condition: string;
    high: string;
    low: string;
    icon: string;
  }>;
  usingLiveData: boolean;
};

export const prototypeDashboardData: DashboardData = {
  homeBase: {
    city: "Chicago",
    region: "Illinois, United States",
    temp: "58",
    feelsLike: "53",
    condition: "Partly cloudy with a gentle breeze",
    high: "64",
    low: "47",
    clothingSuggestion: "Light layers today - a sweater should do the trick.",
    sunrise: "6:12 AM",
    sunset: "7:38 PM",
    sunProgress: 0.65,
    moonrise: "10:42 PM",
    moonset: "8:15 AM",
    moonProgress: 0.3,
    moonPhase: "Waxing Crescent",
    humidity: "62%",
    precipitation: "0.1 in",
    precipChance: "20%",
    wind: "12 mph",
    windDirection: "NW",
    aqi: "42",
    aqiLabel: "Good",
    pollenTree: "Moderate",
    pollenGrass: "Low",
    pollenWeed: "Low",
    visibleDataPoints: ["humidity", "precipitation", "wind", "airQuality", "pollenTree", "pollenGrass"],
    showAstrology: true,
    zodiacSign: "Taurus",
    horoscope:
      "The stars are aligning in your favor today. You may find unexpected clarity in a decision you have been mulling over. Trust your instincts and take that first step - the universe has your back.",
    mood: "reflective",
    luckyNumber: "7",
    luckyColor: "sage green",
    synopsis:
      "Expect a mild start to the week with highs in the upper 50s. Wednesday brings a warm front - perfect for a walk along the lakefront. Heads up though, Thursday and Friday are looking rainy, so save your outdoor plans for the weekend when sunshine returns.",
  },
  favorites: [
    { city: "New York", temp: "62°", feelsLike: "59°", condition: "Mostly sunny", high: "68°", low: "52°", icon: "☀️" },
    { city: "San Francisco", temp: "55°", feelsLike: "52°", condition: "Foggy morning, clearing", high: "61°", low: "49°", icon: "🌫️" },
    { city: "Miami", temp: "82°", feelsLike: "87°", condition: "Hot and humid", high: "86°", low: "74°", icon: "🌤️" },
    { city: "Seattle", temp: "51°", feelsLike: "48°", condition: "Light rain", high: "56°", low: "44°", icon: "🌧️" },
  ],
  usingLiveData: false,
};

const weatherLabels: Record<number, string> = {
  0: "Clear sky",
  1: "Mostly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Foggy",
  48: "Frosty fog",
  51: "Light drizzle",
  53: "Drizzle",
  55: "Steady drizzle",
  61: "Light rain",
  63: "Rain",
  65: "Heavy rain",
  71: "Light snow",
  73: "Snow",
  75: "Heavy snow",
  80: "Rain showers",
  81: "Scattered showers",
  82: "Heavy showers",
  95: "Thunderstorms",
};

const weatherIcons: Record<number, string> = {
  0: "☀️",
  1: "🌤️",
  2: "⛅",
  3: "☁️",
  45: "🌫️",
  48: "🌫️",
  51: "🌦️",
  53: "🌦️",
  55: "🌧️",
  61: "🌧️",
  63: "🌧️",
  65: "🌧️",
  71: "🌨️",
  73: "❄️",
  75: "❄️",
  80: "🌦️",
  81: "🌦️",
  82: "⛈️",
  95: "⛈️",
};

function toTemp(valueC: number | null | undefined, unit: TemperatureUnit) {
  if (valueC == null) return "--";
  if (unit === "c") return `${Math.round(valueC)}`;
  return `${Math.round((valueC * 9) / 5 + 32)}`;
}

function toWind(valueKmh: number | null | undefined, unit: WindUnit) {
  if (valueKmh == null) return "--";
  if (unit === "kmh") return `${Math.round(valueKmh)} km/h`;
  return `${Math.round(valueKmh * 0.621371)} mph`;
}

function toPrecipitation(valueMm: number | null | undefined, unit: TemperatureUnit) {
  if (valueMm == null) return "--";
  if (unit === "c") return `${valueMm.toFixed(1)} mm`;
  return `${(valueMm / 25.4).toFixed(1)} in`;
}

function directionLabel(degrees: number | null | undefined) {
  if (degrees == null) return "--";
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return directions[Math.round(degrees / 45) % 8];
}

function formatRiskLabel(value: string | null | undefined) {
  if (!value) return "Unavailable";
  return value
    .split(" ")
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");
}

function aqiLabel(aqi: number | null | undefined) {
  if (aqi == null) return "Unavailable";
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Unhealthy for sensitive groups";
  if (aqi <= 200) return "Unhealthy";
  return "Very unhealthy";
}

function clothingSuggestion(tempC: number | null | undefined, preference: TemperaturePreference) {
  if (tempC == null) return "Keep an extra layer nearby just in case.";
  const adjusted = preference === "hot" ? tempC + 2 : preference === "cold" ? tempC - 2 : tempC;
  if (adjusted <= 5) return "Bundle up - this is coat weather.";
  if (adjusted <= 12) return "A jacket or sweater will feel right today.";
  if (adjusted <= 20) return "Light layers should be enough.";
  if (adjusted <= 27) return "You can keep it easy and breezy today.";
  return "Dress light and stay cool if you can.";
}

function weeklySynopsis(city: string, highs: number[], precipitationProbabilities: number[]) {
  const warmest = Math.max(...highs);
  const coolest = Math.min(...highs);
  const rainyDays = precipitationProbabilities.filter((value) => value >= 40).length;

  if (rainyDays >= 3) {
    return `${city} is looking on-and-off rainy this week, with highs swinging from ${coolest} to ${warmest}. Keep a small umbrella nearby and save the longer walks for the clearer pockets.`;
  }

  if (warmest - coolest >= 10) {
    return `${city} has a bit of a temperature arc this week, starting cooler and stretching warmer as the days settle in. It is the kind of forecast where layers will earn their keep.`;
  }

  return `${city} stays fairly gentle through the week, with highs hovering between ${coolest} and ${warmest}. Nothing too dramatic - just a steady forecast that should be easy to live with.`;
}

function progressBetween(now: Date, startText: string | null | undefined, endText: string | null | undefined) {
  if (!startText || !endText) return 0.5;

  const [startHour, startMinute, startPeriod] = startText.match(/(\d+):(\d+)\s*(AM|PM)/i)?.slice(1) ?? [];
  const [endHour, endMinute, endPeriod] = endText.match(/(\d+):(\d+)\s*(AM|PM)/i)?.slice(1) ?? [];
  if (!startHour || !endHour || !startMinute || !endMinute || !startPeriod || !endPeriod) return 0.5;

  const start = new Date(now);
  start.setHours((Number(startHour) % 12) + (startPeriod.toUpperCase() === "PM" ? 12 : 0), Number(startMinute), 0, 0);

  const end = new Date(now);
  end.setHours((Number(endHour) % 12) + (endPeriod.toUpperCase() === "PM" ? 12 : 0), Number(endMinute), 0, 0);

  const total = end.getTime() - start.getTime();
  if (total <= 0) return 0.5;

  return Math.max(0, Math.min(1, (now.getTime() - start.getTime()) / total));
}

export async function getDashboardData(userId: string | null): Promise<DashboardData> {
  if (!userId) {
    return prototypeDashboardData;
  }

  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return prototypeDashboardData;
  }

  const { data: preferences } = await supabase
    .from("user_preferences")
    .select("*")
    .eq("clerk_user_id", userId)
    .maybeSingle();

  if (!preferences?.home_city_id) {
    return prototypeDashboardData;
  }

  const [
    homeCityResult,
    favoriteResult,
    currentResult,
    forecastResult,
    airResult,
    pollenResult,
    astronomyResult,
    horoscopeResult,
  ] = await Promise.all([
    supabase.from("cities").select("*").eq("id", preferences.home_city_id).maybeSingle(),
    supabase
      .from("user_favorite_cities")
      .select("position, city_id")
      .eq("clerk_user_id", userId)
      .order("position", { ascending: true }),
    supabase.from("weather_current").select("*"),
    supabase.from("weather_forecast").select("*"),
    supabase.from("air_quality").select("*"),
    supabase.from("pollen").select("*"),
    supabase
      .from("astronomy")
      .select("*")
      .eq("city_id", preferences.home_city_id)
      .order("observed_on", { ascending: false })
      .limit(1)
      .maybeSingle(),
    preferences.astrology_enabled && preferences.zodiac_sign
      ? supabase
          .from("horoscopes")
          .select("*")
          .eq("zodiac_sign", preferences.zodiac_sign)
          .order("horoscope_date", { ascending: false })
          .limit(1)
          .maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  const favoriteCityIds = (favoriteResult.data ?? []).map((row) => row.city_id as string);
  const cityIds = [preferences.home_city_id, ...favoriteCityIds];
  const { data: cityRows } = await supabase.from("cities").select("*").in("id", cityIds);

  const cities = new Map((cityRows ?? []).map((city) => [city.id as string, city]));
  const currentRows = new Map(
    (currentResult.data ?? [])
      .filter((row) => cityIds.includes(row.city_id as string))
      .map((row) => [row.city_id as string, row]),
  );
  const airRows = new Map(
    (airResult.data ?? [])
      .filter((row) => cityIds.includes(row.city_id as string))
      .map((row) => [row.city_id as string, row]),
  );
  const pollenRows = new Map(
    (pollenResult.data ?? [])
      .filter((row) => cityIds.includes(row.city_id as string))
      .map((row) => [row.city_id as string, row]),
  );
  const forecastRows = (forecastResult.data ?? []).filter((row) => cityIds.includes(row.city_id as string));

  const homeCity = homeCityResult.data ?? cities.get(preferences.home_city_id as string);
  if (!homeCity) {
    return prototypeDashboardData;
  }

  const unitTemp = (preferences.units_temp ?? "f") as TemperatureUnit;
  const unitWind = (preferences.units_wind ?? "mph") as WindUnit;
  const preference = (preferences.runs_hot_or_cold ?? "neutral") as TemperaturePreference;
  const homeCurrent = currentRows.get(preferences.home_city_id as string);
  const homeForecast = forecastRows
    .filter((row) => row.city_id === preferences.home_city_id)
    .sort((a, b) => String(a.forecast_date).localeCompare(String(b.forecast_date)));
  const todayForecast = homeForecast[0];
  const homeAir = airRows.get(preferences.home_city_id as string);
  const homePollen = pollenRows.get(preferences.home_city_id as string);
  const homeAstronomy = astronomyResult.data;

  const selectedDataPoints = Array.isArray(preferences.selected_data_points)
    ? (preferences.selected_data_points as WeatherDataPoint[])
    : (["humidity", "precipitation", "wind", "airQuality"] as WeatherDataPoint[]);

  const visibleDataPoints = selectedDataPoints.filter((point) => {
    if (point === "pollenTree") {
      return Boolean(homePollen?.tree_risk || homePollen?.tree_index != null);
    }
    if (point === "pollenGrass") {
      return Boolean(homePollen?.grass_risk || homePollen?.grass_index != null || homePollen?.weed_risk || homePollen?.weed_index != null);
    }
    return true;
  });

  const favoriteCards = (favoriteResult.data ?? [])
    .map((favorite) => {
      const city = cities.get(favorite.city_id as string);
      if (!city) return null;

      const current = currentRows.get(favorite.city_id as string);
      const forecast = forecastRows
        .filter((row) => row.city_id === favorite.city_id)
        .sort((a, b) => String(a.forecast_date).localeCompare(String(b.forecast_date)))[0];

      return {
        city: String(city.name),
        temp: `${toTemp(current?.temperature_c, unitTemp)}°`,
        feelsLike: `${toTemp(current?.feels_like_c, unitTemp)}°`,
        condition: weatherLabels[current?.weather_code as number] ?? "Weather on the way",
        high: `${toTemp(forecast?.temp_max_c, unitTemp)}°`,
        low: `${toTemp(forecast?.temp_min_c, unitTemp)}°`,
        icon: weatherIcons[current?.weather_code as number] ?? "☁️",
      };
    })
    .filter((value): value is DashboardData["favorites"][number] => Boolean(value));

  const highValues = homeForecast
    .map((row) => Number(toTemp(row.temp_max_c, unitTemp)))
    .filter((value) => !Number.isNaN(value));
  const precipValues = homeForecast.map((row) => Number(row.precipitation_probability ?? 0));
  const now = new Date();

  return {
    homeBase: {
      city: String(homeCity.name),
      region: `${String(homeCity.state_code)}, United States`,
      temp: toTemp(homeCurrent?.temperature_c, unitTemp),
      feelsLike: toTemp(homeCurrent?.feels_like_c, unitTemp),
      condition: weatherLabels[homeCurrent?.weather_code as number] ?? "Forecast loading in",
      high: toTemp(todayForecast?.temp_max_c, unitTemp),
      low: toTemp(todayForecast?.temp_min_c, unitTemp),
      clothingSuggestion: clothingSuggestion(homeCurrent?.feels_like_c, preference),
      sunrise: homeAstronomy?.sunrise ?? "--",
      sunset: homeAstronomy?.sunset ?? "--",
      sunProgress: progressBetween(now, homeAstronomy?.sunrise, homeAstronomy?.sunset),
      moonrise: homeAstronomy?.moonrise ?? "--",
      moonset: homeAstronomy?.moonset ?? "--",
      moonProgress: progressBetween(now, homeAstronomy?.moonrise, homeAstronomy?.moonset),
      moonPhase: homeAstronomy?.moon_phase ?? "Moon details soon",
      humidity: homeCurrent?.humidity != null ? `${homeCurrent.humidity}%` : "--",
      precipitation: toPrecipitation(homeCurrent?.precipitation_mm, unitTemp),
      precipChance: todayForecast?.precipitation_probability != null ? `${todayForecast.precipitation_probability}%` : "--",
      wind: toWind(homeCurrent?.wind_speed_kmh, unitWind),
      windDirection: directionLabel(homeCurrent?.wind_direction_deg),
      aqi: homeAir?.us_aqi != null ? String(homeAir.us_aqi) : "--",
      aqiLabel: aqiLabel(homeAir?.us_aqi),
      pollenTree: formatRiskLabel(homePollen?.tree_risk),
      pollenGrass: formatRiskLabel(homePollen?.grass_risk),
      pollenWeed: formatRiskLabel(homePollen?.weed_risk),
      visibleDataPoints,
      showAstrology: Boolean(preferences.astrology_enabled && horoscopeResult.data),
      zodiacSign: preferences.zodiac_sign ?? "",
      horoscope: horoscopeResult.data?.description ?? "",
      mood: horoscopeResult.data?.mood ?? "",
      luckyNumber: horoscopeResult.data?.lucky_number ?? "",
      luckyColor: horoscopeResult.data?.lucky_color ?? "",
      synopsis:
        highValues.length > 0
          ? weeklySynopsis(String(homeCity.name), highValues, precipValues)
          : `${String(homeCity.name)} will start feeling more alive here once your worker writes forecast data.`,
    },
    favorites: favoriteCards,
    usingLiveData: Boolean(homeCurrent || todayForecast || homeAstronomy || homeAir || homePollen),
  };
}
