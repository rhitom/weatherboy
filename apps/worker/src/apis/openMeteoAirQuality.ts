import type { AirQualityRecord } from "@weatherboy/shared";

interface OpenMeteoAirQualityPayload {
  current?: {
    time: string;
    us_aqi: number;
    pm2_5: number;
    pm10: number;
  };
}

export async function fetchOpenMeteoAirQuality(cityId: string, latitude: number, longitude: number) {
  const url = new URL("https://air-quality-api.open-meteo.com/v1/air-quality");
  url.searchParams.set("latitude", String(latitude));
  url.searchParams.set("longitude", String(longitude));
  url.searchParams.set("current", "us_aqi,pm2_5,pm10");
  url.searchParams.set("timezone", "auto");

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Open-Meteo air quality request failed for city ${cityId}`);
  }

  const payload = (await response.json()) as OpenMeteoAirQualityPayload;
  if (!payload.current) {
    return null;
  }

  return {
    cityId,
    observedAt: payload.current.time,
    usAqi: payload.current.us_aqi,
    pm25: payload.current.pm2_5,
    pm10: payload.current.pm10,
  } satisfies AirQualityRecord;
}
