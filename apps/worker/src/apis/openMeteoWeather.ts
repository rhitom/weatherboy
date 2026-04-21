import type { WeatherCurrentRecord, WeatherForecastRecord } from "@weatherboy/shared";

interface OpenMeteoWeatherPayload {
  current?: {
    time: string;
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    precipitation: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    weather_code: number;
  };
  daily?: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    precipitation_probability_max: number[];
    weather_code: number[];
  };
}

export async function fetchOpenMeteoWeather(cityId: string, latitude: number, longitude: number) {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", String(latitude));
  url.searchParams.set("longitude", String(longitude));
  url.searchParams.set(
    "current",
    [
      "temperature_2m",
      "apparent_temperature",
      "relative_humidity_2m",
      "precipitation",
      "wind_speed_10m",
      "wind_direction_10m",
      "weather_code",
    ].join(","),
  );
  url.searchParams.set(
    "daily",
    ["temperature_2m_max", "temperature_2m_min", "precipitation_sum", "precipitation_probability_max", "weather_code"].join(","),
  );
  url.searchParams.set("forecast_days", "7");
  url.searchParams.set("timezone", "auto");

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Open-Meteo weather request failed for city ${cityId}`);
  }

  const payload = (await response.json()) as OpenMeteoWeatherPayload;

  const current = payload.current
    ? ({
        cityId,
        observedAt: payload.current.time,
        temperatureC: payload.current.temperature_2m,
        feelsLikeC: payload.current.apparent_temperature,
        humidity: payload.current.relative_humidity_2m,
        precipitationMm: payload.current.precipitation,
        windSpeedKmh: payload.current.wind_speed_10m,
        windDirectionDeg: payload.current.wind_direction_10m,
        weatherCode: payload.current.weather_code,
      } satisfies WeatherCurrentRecord)
    : null;

  const forecast: WeatherForecastRecord[] = payload.daily
    ? payload.daily.time.map((date, index) => ({
        cityId,
        forecastDate: date,
        tempMaxC: payload.daily!.temperature_2m_max[index],
        tempMinC: payload.daily!.temperature_2m_min[index],
        precipitationSumMm: payload.daily!.precipitation_sum[index],
        precipitationProbability: payload.daily!.precipitation_probability_max[index],
        weatherCode: payload.daily!.weather_code[index],
      }))
    : [];

  return { current, forecast };
}
