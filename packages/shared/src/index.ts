export type TemperaturePreference = "hot" | "neutral" | "cold";
export type TemperatureUnit = "f" | "c";
export type WindUnit = "mph" | "kmh";
export type WeatherDataPoint =
  | "humidity"
  | "precipitation"
  | "wind"
  | "airQuality"
  | "pollenTree"
  | "pollenGrass";

export interface City {
  id: string;
  name: string;
  stateCode: string;
  countryCode: "US";
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface UserPreferences {
  clerkUserId: string;
  homeCityId: string | null;
  runsHotOrCold: TemperaturePreference;
  unitsTemp: TemperatureUnit;
  unitsWind: WindUnit;
  selectedDataPoints: WeatherDataPoint[];
  astrologyEnabled: boolean;
  birthday: string | null;
  zodiacSign: string | null;
  onboardingComplete: boolean;
}

export interface FavoriteCity {
  cityId: string;
  position: number;
}

export interface GeocodedCity {
  name: string;
  stateCode: string;
  countryCode: "US";
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface OnboardingSubmission {
  homeCity: GeocodedCity | null;
  favoriteCities: GeocodedCity[];
  runsHotOrCold: TemperaturePreference;
  selectedDataPoints: WeatherDataPoint[];
  unitsTemp: TemperatureUnit;
  unitsWind: WindUnit;
  astrologyEnabled: boolean;
  birthday: string | null;
}

export interface WeatherCurrentRecord {
  cityId: string;
  observedAt: string;
  temperatureC: number;
  feelsLikeC: number;
  humidity: number;
  precipitationMm: number;
  windSpeedKmh: number;
  windDirectionDeg: number;
  weatherCode: number;
}

export interface WeatherForecastRecord {
  cityId: string;
  forecastDate: string;
  tempMaxC: number;
  tempMinC: number;
  precipitationSumMm: number;
  precipitationProbability: number;
  weatherCode: number;
}

export interface AirQualityRecord {
  cityId: string;
  observedAt: string;
  usAqi: number;
  pm25: number;
  pm10: number;
}

export interface AstronomyRecord {
  cityId: string;
  observedOn: string;
  sunrise: string;
  sunset: string;
  moonrise: string;
  moonset: string;
  moonPhase: string;
  moonIllumination: number;
}

export interface PollenRecord {
  cityId: string;
  observedAt: string;
  grassIndex: number | null;
  grassRisk: string | null;
  treeIndex: number | null;
  treeRisk: string | null;
  weedIndex: number | null;
  weedRisk: string | null;
}

export interface HoroscopeRecord {
  zodiacSign: string;
  horoscopeDate: string;
  description: string;
  mood: string | null;
  luckyNumber: string | null;
  luckyColor: string | null;
  compatibility: string | null;
}
