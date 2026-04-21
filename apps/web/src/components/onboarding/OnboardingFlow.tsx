"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { GeocodedCity, OnboardingSubmission, TemperaturePreference, WeatherDataPoint } from "@weatherboy/shared";
import CitySearch from "@/components/ui/CitySearch";
import { initialOnboardingState, submitOnboarding } from "@/app/onboarding/actions";

const dataPointOptions: { id: WeatherDataPoint; label: string; detail: string }[] = [
  { id: "humidity", label: "humidity", detail: "relative air moisture" },
  { id: "precipitation", label: "precipitation", detail: "rain amount and chance" },
  { id: "wind", label: "wind", detail: "speed and direction" },
  { id: "airQuality", label: "air quality", detail: "aqi and particles" },
  { id: "pollenTree", label: "tree pollen", detail: "tree pollen risk" },
  { id: "pollenGrass", label: "grass pollen", detail: "grass and weed pollen risk" },
];

const steps = [
  { id: "home", title: "home base", detail: "pick the city your dashboard should revolve around" },
  { id: "favorites", title: "favorite cities", detail: "add up to four more places or skip for now" },
  { id: "temperature", title: "temperature lens", detail: "tell weatherboy how your body reads the forecast" },
  { id: "data", title: "dashboard details", detail: "choose the data points that matter most to you" },
  { id: "finish", title: "units and extras", detail: "set units and decide whether astrology belongs in v1" },
];

function cityKey(city: GeocodedCity) {
  return `${city.name}-${city.stateCode}-${city.latitude}-${city.longitude}`;
}

function StepButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      className={`rounded-full px-4 py-2 text-sm lowercase transition ${
        active ? "bg-white text-foreground shadow-sm" : "border border-white/70 text-muted hover:bg-white/35"
      }`}
      type="button"
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default function OnboardingFlow() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(submitOnboarding, initialOnboardingState);
  const [stepIndex, setStepIndex] = useState(0);
  const [homeCity, setHomeCity] = useState<GeocodedCity | null>(null);
  const [favoriteCities, setFavoriteCities] = useState<GeocodedCity[]>([]);
  const [runsHotOrCold, setRunsHotOrCold] = useState<TemperaturePreference>("neutral");
  const [selectedDataPoints, setSelectedDataPoints] = useState<WeatherDataPoint[]>(
    dataPointOptions.map((option) => option.id),
  );
  const [unitsTemp, setUnitsTemp] = useState<"f" | "c">("f");
  const [unitsWind, setUnitsWind] = useState<"mph" | "kmh">("mph");
  const [astrologyEnabled, setAstrologyEnabled] = useState(false);
  const [birthday, setBirthday] = useState("");

  useEffect(() => {
    if (state.status === "success") {
      router.push("/dashboard");
    }
  }, [router, state.status]);

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

  function canAdvance() {
    if (stepIndex === 0) return Boolean(homeCity);
    if (stepIndex === 3) return selectedDataPoints.length > 0;
    if (stepIndex === 4) return !astrologyEnabled || birthday.length > 0;
    return true;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.34fr_0.66fr]">
      <aside className="glass-card p-5">
        <p className="font-serif text-2xl italic lowercase">five small steps</p>
        <div className="mt-5 space-y-3">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`rounded-[1.25rem] border px-4 py-3 transition ${
                index === stepIndex ? "border-white bg-white/70" : "border-white/60 bg-white/30"
              }`}
            >
              <p className="text-xs lowercase text-muted">step {index + 1}</p>
              <p className="mt-1 font-serif text-2xl italic lowercase">{step.title}</p>
              <p className="mt-2 text-sm lowercase text-muted">{step.detail}</p>
            </div>
          ))}
        </div>
      </aside>

      <form action={formAction} className="glass-card p-6 md:p-8">
        <input name="payload" type="hidden" value={JSON.stringify(payload)} />

        <div className="mb-6">
          <p className="text-sm lowercase text-muted">step {stepIndex + 1} of {steps.length}</p>
          <h1 className="mt-2 font-serif text-4xl italic lowercase">{steps[stepIndex].title}</h1>
          <p className="mt-2 max-w-2xl text-sm lowercase text-muted">{steps[stepIndex].detail}</p>
        </div>

        {stepIndex === 0 ? (
          <CitySearch
            excludedCities={favoriteCities}
            hint="this becomes the detailed forecast card at the center of your dashboard"
            label="home city"
            onSelect={setHomeCity}
            value={homeCity}
          />
        ) : null}

        {stepIndex === 1 ? (
          <div className="space-y-5">
            <CitySearch
              excludedCities={homeCity ? [homeCity, ...favoriteCities] : favoriteCities}
              hint="add up to four cities. order of selection becomes display order."
              label="favorite cities"
              onSelect={(city) => {
                if (favoriteCities.length < 4 && !favoriteCities.some((item) => cityKey(item) === cityKey(city))) {
                  setFavoriteCities((current) => [...current, city]);
                }
              }}
              value={null}
            />
            <div className="grid gap-3 sm:grid-cols-2">
              {favoriteCities.map((city, index) => (
                <div key={cityKey(city)} className="rounded-[1.25rem] border border-white/80 bg-white/55 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs lowercase text-muted">favorite {index + 1}</p>
                      <p className="font-serif text-2xl italic lowercase">{city.name}</p>
                      <p className="text-sm lowercase text-muted">{city.stateCode}, united states</p>
                    </div>
                    <button
                      className="text-xs lowercase text-muted underline-offset-4 hover:underline"
                      type="button"
                      onClick={() =>
                        setFavoriteCities((current) => current.filter((item) => cityKey(item) !== cityKey(city)))
                      }
                    >
                      remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {favoriteCities.length === 0 ? (
              <p className="text-sm lowercase text-muted">no favorites yet. you can skip this step and add them later.</p>
            ) : null}
          </div>
        ) : null}

        {stepIndex === 2 ? (
          <div className="space-y-4">
            <p className="text-sm lowercase text-muted">this affects color cues and how strongly “feels like” is emphasized.</p>
            <div className="flex flex-wrap gap-3">
              <StepButton active={runsHotOrCold === "hot"} onClick={() => setRunsHotOrCold("hot")}>
                i run hot
              </StepButton>
              <StepButton active={runsHotOrCold === "neutral"} onClick={() => setRunsHotOrCold("neutral")}>
                pretty neutral
              </StepButton>
              <StepButton active={runsHotOrCold === "cold"} onClick={() => setRunsHotOrCold("cold")}>
                i run cold
              </StepButton>
            </div>
          </div>
        ) : null}

        {stepIndex === 3 ? (
          <div className="grid gap-3 md:grid-cols-2">
            {dataPointOptions.map((option) => {
              const selected = selectedDataPoints.includes(option.id);
              return (
                <button
                  key={option.id}
                  className={`rounded-[1.25rem] border px-4 py-4 text-left transition ${
                    selected ? "border-white bg-white/70" : "border-white/65 bg-white/35"
                  }`}
                  type="button"
                  onClick={() =>
                    setSelectedDataPoints((current) =>
                      current.includes(option.id)
                        ? current.filter((id) => id !== option.id)
                        : [...current, option.id],
                    )
                  }
                >
                  <p className="font-serif text-2xl italic lowercase">{option.label}</p>
                  <p className="mt-2 text-sm lowercase text-muted">{option.detail}</p>
                </button>
              );
            })}
          </div>
        ) : null}

        {stepIndex === 4 ? (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[1.25rem] border border-white/80 bg-white/55 p-4">
                <p className="text-sm lowercase text-muted">temperature units</p>
                <div className="mt-3 flex gap-3">
                  <StepButton active={unitsTemp === "f"} onClick={() => setUnitsTemp("f")}>
                    fahrenheit
                  </StepButton>
                  <StepButton active={unitsTemp === "c"} onClick={() => setUnitsTemp("c")}>
                    celsius
                  </StepButton>
                </div>
              </div>
              <div className="rounded-[1.25rem] border border-white/80 bg-white/55 p-4">
                <p className="text-sm lowercase text-muted">wind units</p>
                <div className="mt-3 flex gap-3">
                  <StepButton active={unitsWind === "mph"} onClick={() => setUnitsWind("mph")}>
                    mph
                  </StepButton>
                  <StepButton active={unitsWind === "kmh"} onClick={() => setUnitsWind("kmh")}>
                    km/h
                  </StepButton>
                </div>
              </div>
            </div>

            <div className="rounded-[1.25rem] border border-white/80 bg-white/55 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-serif text-2xl italic lowercase">astrology</p>
                  <p className="mt-2 text-sm lowercase text-muted">
                    keep horoscope and moon details in the dashboard if you want the extra layer.
                  </p>
                </div>
                <button
                  className={`rounded-full px-4 py-2 text-sm lowercase transition ${
                    astrologyEnabled ? "bg-white text-foreground" : "border border-white/70 text-muted"
                  }`}
                  type="button"
                  onClick={() => setAstrologyEnabled((current) => !current)}
                >
                  {astrologyEnabled ? "enabled" : "opt in"}
                </button>
              </div>

              {astrologyEnabled ? (
                <div className="mt-4">
                  <label className="text-sm lowercase text-muted" htmlFor="birthday">
                    birthday
                  </label>
                  <input
                    id="birthday"
                    className="mt-2 w-full rounded-[1rem] border border-white/80 bg-white/70 px-4 py-3 text-sm outline-none"
                    type="date"
                    value={birthday}
                    onChange={(event) => setBirthday(event.target.value)}
                  />
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        {state.message ? (
          <p className={`mt-6 text-sm lowercase ${state.status === "error" ? "text-rose-700" : "text-emerald-700"}`}>
            {state.message}
          </p>
        ) : null}

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-3">
            {stepIndex > 0 ? (
              <button
                className="rounded-full border border-white/75 px-5 py-3 text-sm lowercase transition hover:bg-white/40"
                type="button"
                onClick={() => setStepIndex((current) => current - 1)}
              >
                back
              </button>
            ) : null}
            {stepIndex === 1 ? (
              <button
                className="rounded-full border border-white/75 px-5 py-3 text-sm lowercase text-muted transition hover:bg-white/40"
                type="button"
                onClick={() => setStepIndex(2)}
              >
                skip for now
              </button>
            ) : null}
          </div>

          {stepIndex < steps.length - 1 ? (
            <button
              className="rounded-full bg-white/90 px-5 py-3 text-sm lowercase shadow-sm transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
              disabled={!canAdvance()}
              type="button"
              onClick={() => setStepIndex((current) => current + 1)}
            >
              next
            </button>
          ) : (
            <button
              className="rounded-full bg-white/90 px-5 py-3 text-sm lowercase shadow-sm transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
              disabled={!canAdvance() || isPending}
              type="submit"
            >
              {isPending ? "saving..." : "finish onboarding"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
