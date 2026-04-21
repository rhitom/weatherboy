import { redirect } from "next/navigation";
import GradientBackground from "@/components/dashboard/GradientBackground";
import SettingsEditor from "@/components/settings/SettingsEditor";
import SetupNotice from "@/components/ui/SetupNotice";
import { getViewerState } from "@/lib/viewer";
import { hasClerkConfig } from "@/lib/env";
import { getSettingsData } from "@/lib/settings-data";

export default async function SettingsPage() {
  const viewer = await getViewerState();

  if (hasClerkConfig() && !viewer.userId) {
    redirect("/sign-in");
  }

  const settings = await getSettingsData(viewer.userId);

  return (
    <GradientBackground>
      <main className="mx-auto min-h-screen max-w-4xl px-4 py-8 md:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-4xl italic lowercase">settings</h1>
            <p className="mt-2 text-sm lowercase text-muted">
              saved preferences are visible here now. edit actions are the next pass.
            </p>
          </div>
        </div>
        <div className="glass-card space-y-4 p-6">
          <SetupNotice />
          {!settings.usingSavedSettings ? (
            <p className="text-sm lowercase text-muted">
              showing the prototype settings view until Supabase is configured and this user has saved preferences.
            </p>
          ) : null}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[1.25rem] border border-white/80 bg-white/45 p-4">
              <p className="text-xs lowercase text-muted">home base</p>
              <p className="mt-2 font-serif text-2xl italic lowercase">{settings.homeCity}</p>
            </div>
            <div className="rounded-[1.25rem] border border-white/80 bg-white/45 p-4">
              <p className="text-xs lowercase text-muted">temperature lens</p>
              <p className="mt-2 font-serif text-2xl italic lowercase">{settings.runsHotOrCold}</p>
            </div>
            <div className="rounded-[1.25rem] border border-white/80 bg-white/45 p-4">
              <p className="text-xs lowercase text-muted">units</p>
              <p className="mt-2 text-sm lowercase text-muted">
                temperature: <span className="text-foreground">{settings.unitsTemp}</span>
              </p>
              <p className="mt-1 text-sm lowercase text-muted">
                wind: <span className="text-foreground">{settings.unitsWind}</span>
              </p>
            </div>
            <div className="rounded-[1.25rem] border border-white/80 bg-white/45 p-4">
              <p className="text-xs lowercase text-muted">astrology</p>
              <p className="mt-2 text-sm lowercase text-muted">
                enabled: <span className="text-foreground">{settings.astrologyEnabled ? "yes" : "no"}</span>
              </p>
              <p className="mt-1 text-sm lowercase text-muted">
                zodiac: <span className="text-foreground">{settings.zodiacSign ?? "not set"}</span>
              </p>
            </div>
          </div>
          <div className="rounded-[1.25rem] border border-white/80 bg-white/45 p-4">
            <p className="text-xs lowercase text-muted">favorite cities</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {settings.favoriteCities.length > 0 ? (
                settings.favoriteCities.map((city) => (
                  <span key={city} className="rounded-full border border-white/80 bg-white/60 px-3 py-2 text-sm lowercase">
                    {city}
                  </span>
                ))
              ) : (
                <span className="text-sm lowercase text-muted">no favorites saved yet</span>
              )}
            </div>
          </div>
          <div className="rounded-[1.25rem] border border-white/80 bg-white/45 p-4">
            <p className="text-xs lowercase text-muted">visible data points</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {settings.selectedDataPoints.map((point) => (
                <span key={point} className="rounded-full border border-white/80 bg-white/60 px-3 py-2 text-sm lowercase">
                  {point}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-[1.25rem] border border-white/80 bg-white/35 p-4">
            <p className="mb-4 text-xs lowercase text-muted">edit preferences</p>
            <SettingsEditor initialValue={settings.initialForm} />
          </div>
        </div>
      </main>
    </GradientBackground>
  );
}
