import type { PollenRecord } from "@weatherboy/shared";
import { workerEnv } from "../env.js";

function getRiskLabel(code?: string) {
  return code ? code.toLowerCase().replace(/_/g, " ") : null;
}

export async function fetchGooglePollen(cityId: string, latitude: number, longitude: number) {
  if (!workerEnv.googlePollenApiKey) {
    return null;
  }

  const url = new URL(`https://pollen.googleapis.com/v1/forecast:lookup`);
  url.searchParams.set("key", workerEnv.googlePollenApiKey);
  url.searchParams.set("location.latitude", String(latitude));
  url.searchParams.set("location.longitude", String(longitude));
  url.searchParams.set("days", "1");

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Google Pollen request failed for city ${cityId}`);
  }

  const payload = (await response.json()) as {
    dailyInfo?: Array<{
      date?: { year: number; month: number; day: number };
      plantInfo?: Array<{
        code?: string;
        indexInfo?: { value?: number; category?: string };
      }>;
    }>;
  };

  const today = payload.dailyInfo?.[0];
  if (!today) {
    return null;
  }

  const byCode = new Map(today.plantInfo?.map((item) => [item.code, item]) ?? []);
  const observedAt = today.date
    ? new Date(Date.UTC(today.date.year, today.date.month - 1, today.date.day)).toISOString()
    : new Date().toISOString();

  return {
    cityId,
    observedAt,
    grassIndex: byCode.get("GRASS")?.indexInfo?.value ?? null,
    grassRisk: getRiskLabel(byCode.get("GRASS")?.indexInfo?.category),
    treeIndex: byCode.get("TREE")?.indexInfo?.value ?? null,
    treeRisk: getRiskLabel(byCode.get("TREE")?.indexInfo?.category),
    weedIndex: byCode.get("WEED")?.indexInfo?.value ?? null,
    weedRisk: getRiskLabel(byCode.get("WEED")?.indexInfo?.category),
  } satisfies PollenRecord;
}
