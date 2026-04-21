import { createWorkerSupabaseClient } from "./db/supabase.js";
import { fetchOpenMeteoWeather } from "./apis/openMeteoWeather.js";
import { fetchOpenMeteoAirQuality } from "./apis/openMeteoAirQuality.js";
import { fetchWeatherApiAstronomy } from "./apis/weatherApiAstronomy.js";
import { fetchGooglePollen } from "./apis/googlePollen.js";
import { fetchAztroHoroscope } from "./apis/aztroHoroscope.js";

interface ActiveCity {
  id: string;
  latitude: number;
  longitude: number;
}

interface ActiveSignRow {
  zodiac_sign: string | null;
}

async function fetchActiveCities() {
  const supabase = createWorkerSupabaseClient();
  const [homeCityResult, favoriteCityResult] = await Promise.all([
    supabase
      .from("user_preferences")
      .select("home_city_id")
      .eq("onboarding_complete", true)
      .not("home_city_id", "is", null),
    supabase.from("user_favorite_cities").select("city_id"),
  ]);

  if (homeCityResult.error) {
    throw new Error(`Could not fetch active home cities: ${homeCityResult.error.message}`);
  }

  if (favoriteCityResult.error) {
    throw new Error(`Could not fetch active favorite cities: ${favoriteCityResult.error.message}`);
  }

  const cityIds = new Set<string>();

  for (const row of homeCityResult.data ?? []) {
    if (row.home_city_id) {
      cityIds.add(String(row.home_city_id));
    }
  }

  for (const row of favoriteCityResult.data ?? []) {
    if (row.city_id) {
      cityIds.add(String(row.city_id));
    }
  }

  if (cityIds.size === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from("cities")
    .select("id, latitude, longitude")
    .in("id", [...cityIds]);

  if (error) {
    throw new Error(`Could not fetch active cities: ${error.message}`);
  }

  return (data ?? []) as ActiveCity[];
}

async function fetchActiveZodiacSigns() {
  const supabase = createWorkerSupabaseClient();
  const { data, error } = await supabase
    .from("user_preferences")
    .select("zodiac_sign")
    .eq("astrology_enabled", true)
    .not("zodiac_sign", "is", null);

  if (error) {
    throw new Error(`Could not fetch active zodiac signs: ${error.message}`);
  }

  const signs = new Set(
    ((data ?? []) as ActiveSignRow[])
      .map((row) => row.zodiac_sign)
      .filter((value): value is string => Boolean(value)),
  );

  return [...signs];
}

export async function syncWeatherboyData() {
  const supabase = createWorkerSupabaseClient();
  const today = new Date().toISOString().slice(0, 10);
  const cities = await fetchActiveCities();

  for (const city of cities) {
    const weather = await fetchOpenMeteoWeather(city.id, city.latitude, city.longitude);
    const airQuality = await fetchOpenMeteoAirQuality(city.id, city.latitude, city.longitude);
    const astronomy = await fetchWeatherApiAstronomy(city.id, city.latitude, city.longitude, today);
    const pollen = await fetchGooglePollen(city.id, city.latitude, city.longitude);

    if (weather.current) {
      await supabase.from("weather_current").upsert(
        {
          city_id: weather.current.cityId,
          observed_at: weather.current.observedAt,
          temperature_c: weather.current.temperatureC,
          feels_like_c: weather.current.feelsLikeC,
          humidity: weather.current.humidity,
          precipitation_mm: weather.current.precipitationMm,
          wind_speed_kmh: weather.current.windSpeedKmh,
          wind_direction_deg: weather.current.windDirectionDeg,
          weather_code: weather.current.weatherCode,
        },
        { onConflict: "city_id" },
      );
    }

    if (weather.forecast.length > 0) {
      await supabase.from("weather_forecast").upsert(
        weather.forecast.map((day: (typeof weather.forecast)[number]) => ({
          city_id: day.cityId,
          forecast_date: day.forecastDate,
          temp_max_c: day.tempMaxC,
          temp_min_c: day.tempMinC,
          precipitation_sum_mm: day.precipitationSumMm,
          precipitation_probability: day.precipitationProbability,
          weather_code: day.weatherCode,
        })),
        { onConflict: "city_id,forecast_date" },
      );
    }

    if (airQuality) {
      await supabase.from("air_quality").upsert(
        {
          city_id: airQuality.cityId,
          observed_at: airQuality.observedAt,
          us_aqi: airQuality.usAqi,
          pm2_5: airQuality.pm25,
          pm10: airQuality.pm10,
        },
        { onConflict: "city_id" },
      );
    }

    if (astronomy) {
      await supabase.from("astronomy").upsert(
        {
          city_id: astronomy.cityId,
          observed_on: astronomy.observedOn,
          sunrise: astronomy.sunrise,
          sunset: astronomy.sunset,
          moonrise: astronomy.moonrise,
          moonset: astronomy.moonset,
          moon_phase: astronomy.moonPhase,
          moon_illumination: astronomy.moonIllumination,
        },
        { onConflict: "city_id,observed_on" },
      );
    }

    if (pollen) {
      await supabase.from("pollen").upsert(
        {
          city_id: pollen.cityId,
          observed_at: pollen.observedAt,
          grass_index: pollen.grassIndex,
          grass_risk: pollen.grassRisk,
          tree_index: pollen.treeIndex,
          tree_risk: pollen.treeRisk,
          weed_index: pollen.weedIndex,
          weed_risk: pollen.weedRisk,
        },
        { onConflict: "city_id" },
      );
    }
  }

  const zodiacSigns = await fetchActiveZodiacSigns();
  for (const sign of zodiacSigns) {
    const horoscope = await fetchAztroHoroscope(sign, today);
    await supabase.from("horoscopes").upsert(
      {
        zodiac_sign: horoscope.zodiacSign,
        horoscope_date: horoscope.horoscopeDate,
        description: horoscope.description,
        mood: horoscope.mood,
        lucky_number: horoscope.luckyNumber,
        lucky_color: horoscope.luckyColor,
        compatibility: horoscope.compatibility,
      },
      { onConflict: "zodiac_sign,horoscope_date" },
    );
  }

  return {
    syncedCities: cities.length,
    syncedSigns: zodiacSigns.length,
    syncedAt: new Date().toISOString(),
  };
}
