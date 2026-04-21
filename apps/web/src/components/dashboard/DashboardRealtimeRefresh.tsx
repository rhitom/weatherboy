"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export default function DashboardRealtimeRefresh({
  enabled,
  zodiacSign,
}: {
  enabled: boolean;
  zodiacSign: string | null;
}) {
  const router = useRouter();
  const refreshTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      return;
    }

    const scheduleRefresh = () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }

      refreshTimeoutRef.current = setTimeout(() => {
        router.refresh();
      }, 400);
    };

    const channel = supabase
      .channel("weatherboy-dashboard-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "weather_current" }, scheduleRefresh)
      .on("postgres_changes", { event: "*", schema: "public", table: "weather_forecast" }, scheduleRefresh)
      .on("postgres_changes", { event: "*", schema: "public", table: "air_quality" }, scheduleRefresh)
      .on("postgres_changes", { event: "*", schema: "public", table: "pollen" }, scheduleRefresh)
      .on("postgres_changes", { event: "*", schema: "public", table: "astronomy" }, scheduleRefresh);

    if (zodiacSign) {
      channel.on(
        "postgres_changes",
        { event: "*", schema: "public", table: "horoscopes", filter: `zodiac_sign=eq.${zodiacSign}` },
        scheduleRefresh,
      );
    }

    channel.subscribe();

    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }

      void supabase.removeChannel(channel);
    };
  }, [enabled, router, zodiacSign]);

  return null;
}
