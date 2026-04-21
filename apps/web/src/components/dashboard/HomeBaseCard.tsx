"use client";

import type { WeatherDataPoint } from "@weatherboy/shared";
import SunMoonArc from "./SunMoonArc";
import AstrologyCard from "./AstrologyCard";
import WeeklySynopsis from "./WeeklySynopsis";
import DataPointCard from "./DataPointCard";

interface HomeBaseCardProps {
  city: string;
  region: string;
  temp: string;
  feelsLike: string;
  condition: string;
  high: string;
  low: string;
  clothingSuggestion: string;
  sunrise: string;
  sunset: string;
  sunProgress: number;
  moonrise: string;
  moonset: string;
  moonProgress: number;
  moonPhase: string;
  humidity: string;
  precipitation: string;
  precipChance: string;
  wind: string;
  windDirection: string;
  aqi: string;
  aqiLabel: string;
  pollenTree: string;
  pollenGrass: string;
  pollenWeed: string;
  visibleDataPoints: WeatherDataPoint[];
  showAstrology: boolean;
  zodiacSign: string;
  horoscope: string;
  mood: string;
  luckyNumber: string;
  luckyColor: string;
  synopsis: string;
}

function getTempColor(temp: number, runsHot: boolean): string {
  const adjusted = runsHot ? temp + 5 : temp - 5;
  if (adjusted >= 85) return "text-[#c4736e]";
  if (adjusted >= 70) return "text-[#b89a6b]";
  if (adjusted >= 55) return "text-[#7b8fa8]";
  if (adjusted >= 40) return "text-[#6e80a4]";
  return "text-[#5c6b8a]";
}

export default function HomeBaseCard(props: HomeBaseCardProps) {
  const tempNum = Number.parseInt(props.temp, 10);
  const tempColor = getTempColor(Number.isNaN(tempNum) ? 55 : tempNum, false);
  const visible = new Set(props.visibleDataPoints);

  return (
    <div className="glass-card flex flex-col gap-4 p-6 md:p-8">
      <div>
        <h1 className="font-serif text-4xl italic tracking-tight lowercase md:text-5xl">{props.city}</h1>
        <p className="mt-1 text-sm lowercase text-muted">{props.region}</p>
      </div>

      <div className="flex items-start gap-4">
        <div>
          <span className={`text-7xl font-light ${tempColor}`}>{props.temp}°</span>
        </div>
        <div className="flex flex-col gap-1 pt-3">
          <p className="text-sm lowercase">
            feels like <span className="font-medium">{props.feelsLike}°</span>
          </p>
          <p className="text-sm lowercase text-muted">{props.condition}</p>
          <div className="mt-1 flex gap-3 text-xs lowercase text-muted">
            <span>h: {props.high}°</span>
            <span>l: {props.low}°</span>
          </div>
          <p className="mt-1 text-xs italic lowercase text-accent-warm">{props.clothingSuggestion}</p>
        </div>
      </div>

      <div className="mt-2 flex flex-wrap justify-center gap-6">
        <SunMoonArc
          label="sunrise & sunset"
          riseTime={props.sunrise}
          setTime={props.sunset}
          progress={props.sunProgress}
          color="#d4a574"
          glowColor="#e8c9a0"
          icon="☀️"
        />
        <SunMoonArc
          label="moonrise & moonset"
          riseTime={props.moonrise}
          setTime={props.moonset}
          progress={props.moonProgress}
          color="#a78bfa"
          glowColor="#c4b5fd"
          icon="🌙"
        />
      </div>

      {props.showAstrology ? (
        <AstrologyCard
          sign={props.zodiacSign}
          horoscope={props.horoscope}
          mood={props.mood}
          luckyNumber={props.luckyNumber}
          luckyColor={props.luckyColor}
          moonPhase={props.moonPhase}
        />
      ) : null}

      <div className="mt-2 grid grid-cols-2 gap-3 md:grid-cols-3">
        {visible.has("humidity") ? (
          <DataPointCard icon="💧" label="Humidity" value={props.humidity} sublabel="relative" />
        ) : null}
        {visible.has("precipitation") ? (
          <DataPointCard icon="🌧️" label="Precipitation" value={props.precipitation} sublabel={`${props.precipChance} chance`} />
        ) : null}
        {visible.has("wind") ? (
          <DataPointCard icon="💨" label="Wind" value={props.wind} sublabel={props.windDirection} />
        ) : null}
        {visible.has("airQuality") ? (
          <DataPointCard icon="🫁" label="Air Quality" value={props.aqi} sublabel={props.aqiLabel} />
        ) : null}
        {visible.has("pollenTree") ? (
          <DataPointCard icon="🌳" label="Pollen - Tree" value={props.pollenTree} />
        ) : null}
        {visible.has("pollenGrass") ? (
          <DataPointCard icon="🌾" label="Pollen - Grass" value={props.pollenGrass} sublabel={`Weed: ${props.pollenWeed}`} />
        ) : null}
      </div>

      <WeeklySynopsis synopsis={props.synopsis} />
    </div>
  );
}
