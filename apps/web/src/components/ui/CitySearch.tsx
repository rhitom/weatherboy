"use client";

import { useEffect, useState } from "react";
import type { GeocodedCity } from "@weatherboy/shared";

export default function CitySearch({
  label,
  hint,
  value,
  onSelect,
  excludedCities = [],
}: {
  label: string;
  hint: string;
  value: GeocodedCity | null;
  onSelect: (city: GeocodedCity) => void;
  excludedCities?: GeocodedCity[];
}) {
  const [query, setQuery] = useState(() => (value ? `${value.name}, ${value.stateCode}` : ""));
  const [results, setResults] = useState<GeocodedCity[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const trimmed = query.trim();

    if (trimmed.length < 2) {
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      setIsLoading(true);

      try {
        const response = await fetch(`/api/geocode?q=${encodeURIComponent(trimmed)}`, {
          signal: controller.signal,
        });
        const payload = (await response.json()) as { results: GeocodedCity[] };

        const excludedKeys = new Set(
          excludedCities.map((city) => `${city.name}-${city.stateCode}-${city.latitude}-${city.longitude}`),
        );

        setResults(
          payload.results.filter(
            (city) => !excludedKeys.has(`${city.name}-${city.stateCode}-${city.latitude}-${city.longitude}`),
          ),
        );
      } catch {
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [excludedCities, query]);

  const visibleResults = query.trim().length >= 2 ? results : [];

  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-medium lowercase">{label}</p>
        <p className="mt-1 text-sm lowercase text-muted">{hint}</p>
      </div>
      <div className="rounded-[1.25rem] border border-white/85 bg-white/55 p-3">
        <input
          className="w-full bg-transparent text-sm lowercase outline-none placeholder:text-muted"
          placeholder="start typing a us city"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>
      {isLoading ? <p className="text-xs lowercase text-muted">searching...</p> : null}
      {visibleResults.length > 0 ? (
        <div className="grid gap-2">
          {visibleResults.map((city) => (
            <button
              key={`${city.name}-${city.stateCode}-${city.latitude}-${city.longitude}`}
              className="rounded-[1rem] border border-white/80 bg-white/45 px-4 py-3 text-left transition hover:bg-white/65"
              type="button"
              onClick={() => {
                setQuery(`${city.name}, ${city.stateCode}`);
                onSelect(city);
                setResults([]);
              }}
            >
              <p className="font-serif text-xl italic lowercase">{city.name}</p>
              <p className="text-sm lowercase text-muted">{city.stateCode}, united states</p>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
