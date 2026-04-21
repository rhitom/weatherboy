import type { HoroscopeRecord } from "@weatherboy/shared";

export async function fetchAztroHoroscope(sign: string, date: string) {
  const url = new URL("https://aztro.sameerkumar.website/");
  url.searchParams.set("sign", sign.toLowerCase());
  url.searchParams.set("day", "today");

  const response = await fetch(url, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(`Aztro request failed for sign ${sign}`);
  }

  const payload = (await response.json()) as {
    description?: string;
    mood?: string;
    lucky_number?: string;
    color?: string;
    compatibility?: string;
  };

  return {
    zodiacSign: sign,
    horoscopeDate: date,
    description: payload.description || "",
    mood: payload.mood || null,
    luckyNumber: payload.lucky_number || null,
    luckyColor: payload.color || null,
    compatibility: payload.compatibility || null,
  } satisfies HoroscopeRecord;
}
