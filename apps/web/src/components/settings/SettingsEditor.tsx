"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { OnboardingSubmission, TemperaturePreference, WeatherDataPoint } from "@weatherboy/shared";
import CitySearch from "@/components/ui/CitySearch";

const dataPointOptions: { id: WeatherDataPoint; label: string }[] = [
  { id: "humidity", label: "humidity" },
  { id: "precipitation", label: "precipitation" },
  { id: "wind", label: "wind" },
  { id: "airQuality", label: "air quality" },
  { id: "pollenTree", label: "tree pollen" },
  { id: "pollenGrass", label: "grass pollen" },
];

function cityKey(city: NonNullable<OnboardingSubmission["homeCity"]>) {
  return `${city.name}-${city.stateCode}-${city.latitude}-${city.longitude}`;
}

export default function SettingsEditor({
  initialValue,
}: {
  initialValue: OnboardingSubmission;
}) {
  const router = useRouter();
  const [homeCity, setHomeCity] = useState(initialValue.homeCity);
  const [favoriteCities, setFavoriteCities] = useState(initialValue.favoriteCities);
  const [runsHotOrCold, setRunsHotOrCold] = useState<TemperaturePreference>(initialValue.runsHotOrCold);
  const [selectedDataPoints, setSelectedDataPoints] = useState<WeatherDataPoint[]>(initialValue.selectedDataPoints);
  const [unitsTemp, setUnitsTemp] = useState<"f" | "c">(initialValue.unitsTemp);
  const [unitsWind, setUnitsWind] = useState<"mph" | "kmh">(initialValue.unitsWind);
  const [astrologyEnabled, setAstrologyEnabled] = useState(initialValue.astrologyEnabled);
  const [birthday, setBirthday] = useState(initialValue.birthday ?? "");
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"error" | "success" | "idle">("idle");

  async function handleSave() {
    if (!homeCity || selectedDataPoints.length === 0 || (astrologyEnabled && !birthday) || isPending) {
      return;
    }

    const payload: OnboardingSubmission = {
      homeCity,
      favoriteCities,
      runsHotOrCold,
      selectedDataPoints,
      unitsTemp,
      unitsWind,
      astrologyEnabled,
      birthday: astrologyEnabled && birthday ? birthday : null,
    };

    setIsPending(true);
    setMessage("");
    setMessageType("idle");

    try {
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = (await response.json()) as { ok: boolean; message: string };

      if (!response.ok || !result.ok) {
        setMessage(result.message || "Something went wrong while saving settings.");
        setMessageType("error");
        return;
      }

      setMessage(result.message || "Settings saved.");
      setMessageType("success");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Something went wrong while saving settings.");
      setMessageType("error");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-[1.25rem] border border-white/80 bg-white/45 p-4">
          <CitySearch
            excludedCities={favoriteCities}
            hint="change the main city at the center of your dashboard"
            label="home base"
            onSelect={setHomeCity}
            value={homeCity}
          />
        </div>

        <div className="rounded-[1.25rem] border border-white/80 bg-white/45 p-4">
          <p className="text-xs lowercase text-muted">temperature lens</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {(["hot", "neutral", "cold"] as const).map((option) => (
              <button
                key={option}
                className={`rounded-full px-4 py-2 text-sm lowercase transition ${
                  runsHotOrCold === option ? "bg-white text-foreground" : "border border-white/70 text-muted hover:bg-white/35"
                }`}
                type="button"
                onClick={() => setRunsHotOrCold(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-[1.25rem] border border-white/80 bg-white/45 p-4">
        <p className="text-xs lowercase text-muted">favorite cities</p>
        <div className="mt-3">
          <CitySearch
            excludedCities={homeCity ? [homeCity, ...favoriteCities] : favoriteCities}
            hint="add up to four cities. selection order becomes display order."
            label="favorites"
            onSelect={(city) => {
              if (favoriteCities.length < 4 && !favoriteCities.some((item) => cityKey(item) === cityKey(city))) {
                setFavoriteCities((current) => [...current, city]);
              }
            }}
            value={null}
          />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {favoriteCities.length > 0 ? (
            favoriteCities.map((city) => (
              <button
                key={cityKey(city)}
                className="rounded-full border border-white/80 bg-white/60 px-3 py-2 text-sm lowercase"
                type="button"
                onClick={() => setFavoriteCities((current) => current.filter((item) => cityKey(item) !== cityKey(city)))}
              >
                {city.name}, {city.stateCode} ×
              </button>
            ))
          ) : (
            <span className="text-sm lowercase text-muted">no favorites saved yet</span>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-[1.25rem] border border-white/80 bg-white/45 p-4">
          <p className="text-xs lowercase text-muted">units</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              className={`rounded-full px-4 py-2 text-sm lowercase transition ${unitsTemp === "f" ? "bg-white text-foreground" : "border border-white/70 text-muted hover:bg-white/35"}`}
              type="button"
              onClick={() => setUnitsTemp("f")}
            >
              fahrenheit
            </button>
            <button
              className={`rounded-full px-4 py-2 text-sm lowercase transition ${unitsTemp === "c" ? "bg-white text-foreground" : "border border-white/70 text-muted hover:bg-white/35"}`}
              type="button"
              onClick={() => setUnitsTemp("c")}
            >
              celsius
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              className={`rounded-full px-4 py-2 text-sm lowercase transition ${unitsWind === "mph" ? "bg-white text-foreground" : "border border-white/70 text-muted hover:bg-white/35"}`}
              type="button"
              onClick={() => setUnitsWind("mph")}
            >
              mph
            </button>
            <button
              className={`rounded-full px-4 py-2 text-sm lowercase transition ${unitsWind === "kmh" ? "bg-white text-foreground" : "border border-white/70 text-muted hover:bg-white/35"}`}
              type="button"
              onClick={() => setUnitsWind("kmh")}
            >
              km/h
            </button>
          </div>
        </div>

        <div className="rounded-[1.25rem] border border-white/80 bg-white/45 p-4">
          <p className="text-xs lowercase text-muted">astrology</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              className={`rounded-full px-4 py-2 text-sm lowercase transition ${astrologyEnabled ? "bg-white text-foreground" : "border border-white/70 text-muted hover:bg-white/35"}`}
              type="button"
              onClick={() => setAstrologyEnabled(true)}
            >
              enabled
            </button>
            <button
              className={`rounded-full px-4 py-2 text-sm lowercase transition ${!astrologyEnabled ? "bg-white text-foreground" : "border border-white/70 text-muted hover:bg-white/35"}`}
              type="button"
              onClick={() => {
                setAstrologyEnabled(false);
                setBirthday("");
              }}
            >
              off
            </button>
          </div>
          {astrologyEnabled ? (
            <input
              className="mt-4 w-full rounded-[1rem] border border-white/80 bg-white/70 px-4 py-3 text-sm outline-none"
              type="date"
              value={birthday}
              onChange={(event) => setBirthday(event.target.value)}
            />
          ) : null}
        </div>
      </div>

      <div className="rounded-[1.25rem] border border-white/80 bg-white/45 p-4">
        <p className="text-xs lowercase text-muted">visible data points</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {dataPointOptions.map((option) => {
            const selected = selectedDataPoints.includes(option.id);
            return (
              <button
                key={option.id}
                className={`rounded-full px-4 py-2 text-sm lowercase transition ${
                  selected ? "bg-white text-foreground" : "border border-white/70 text-muted hover:bg-white/35"
                }`}
                type="button"
                onClick={() =>
                  setSelectedDataPoints((current) =>
                    current.includes(option.id)
                      ? current.filter((value) => value !== option.id)
                      : [...current, option.id],
                  )
                }
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {message ? (
        <p className={`text-sm lowercase ${messageType === "error" ? "text-rose-700" : "text-emerald-700"}`}>
          {message}
        </p>
      ) : null}

      <div className="flex justify-end">
        <button
          className="rounded-full bg-white/90 px-5 py-3 text-sm lowercase shadow-sm transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
          disabled={!homeCity || selectedDataPoints.length === 0 || (astrologyEnabled && !birthday) || isPending}
          type="button"
          onClick={handleSave}
        >
          {isPending ? "saving..." : "save settings"}
        </button>
      </div>
    </div>
  );
}
