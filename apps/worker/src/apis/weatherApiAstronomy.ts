import type { AstronomyRecord } from "@weatherboy/shared";
import { workerEnv } from "../env.js";

export async function fetchWeatherApiAstronomy(cityId: string, latitude: number, longitude: number, date: string) {
  if (!workerEnv.weatherApiKey) {
    return null;
  }

  const url = new URL("https://api.weatherapi.com/v1/astronomy.json");
  url.searchParams.set("key", workerEnv.weatherApiKey);
  url.searchParams.set("q", `${latitude},${longitude}`);
  url.searchParams.set("dt", date);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`WeatherAPI astronomy request failed for city ${cityId}`);
  }

  const payload = (await response.json()) as {
    astronomy?: {
      astro?: {
        sunrise?: string;
        sunset?: string;
        moonrise?: string;
        moonset?: string;
        moon_phase?: string;
        moon_illumination?: string;
      };
    };
  };

  const astro = payload.astronomy?.astro;
  if (!astro) {
    return null;
  }

  return {
    cityId,
    observedOn: date,
    sunrise: astro.sunrise || "",
    sunset: astro.sunset || "",
    moonrise: astro.moonrise || "",
    moonset: astro.moonset || "",
    moonPhase: astro.moon_phase || "",
    moonIllumination: Number(astro.moon_illumination || 0),
  } satisfies AstronomyRecord;
}
