import { NextResponse } from "next/server";
import type { GeocodedCity } from "@weatherboy/shared";

interface OpenMeteoGeocodeResult {
  name: string;
  country_code: string;
  admin1?: string;
  admin1_code?: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim() ?? "";

  if (query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
  url.searchParams.set("name", query);
  url.searchParams.set("count", "8");
  url.searchParams.set("countryCode", "US");
  url.searchParams.set("language", "en");
  url.searchParams.set("format", "json");

  const response = await fetch(url, {
    next: { revalidate: 60 * 60 * 24 },
  });

  if (!response.ok) {
    return NextResponse.json({ results: [] }, { status: 200 });
  }

  const payload = (await response.json()) as {
    results?: OpenMeteoGeocodeResult[];
  };

  const results: GeocodedCity[] = (payload.results ?? [])
    .filter((item) => item.country_code === "US")
    .map((item) => ({
      name: item.name,
      stateCode: item.admin1_code ?? item.admin1 ?? "",
      countryCode: "US",
      latitude: item.latitude,
      longitude: item.longitude,
      timezone: item.timezone,
    }));

  return NextResponse.json({ results });
}
