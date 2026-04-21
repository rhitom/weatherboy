import Link from "next/link";
import { redirect } from "next/navigation";
import PixelSkyMark from "@/components/branding/PixelSkyMark";
import GradientBackground from "@/components/dashboard/GradientBackground";
import SetupNotice from "@/components/ui/SetupNotice";
import { getViewerState } from "@/lib/viewer";
import { hasClerkConfig } from "@/lib/env";

export default async function Home() {
  const viewer = await getViewerState();

  if (viewer.userId) {
    redirect(viewer.onboardingComplete ? "/dashboard" : "/onboarding");
  }

  return (
    <GradientBackground>
      <main className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-6 md:px-8">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <PixelSkyMark size={38} />
            <span className="font-serif text-2xl italic lowercase">weatherboy</span>
          </div>
          <nav className="flex items-center gap-3 text-sm lowercase">
            <Link className="rounded-full border border-white/70 px-4 py-2 transition hover:bg-white/40" href="/sign-in">
              sign in
            </Link>
            <Link className="rounded-full bg-white/80 px-4 py-2 text-foreground transition hover:bg-white" href="/sign-up">
              sign up
            </Link>
          </nav>
        </header>

        <section className="flex flex-1 items-center py-12 md:py-20">
          <div className="grid w-full gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="flex flex-col justify-center gap-6">
              <div className="flex items-center gap-3 text-sm lowercase text-muted">
                <PixelSkyMark size={22} />
                <span>live weather, softer edges</span>
              </div>
              <div className="max-w-2xl space-y-4">
                <h1 className="font-serif text-5xl italic leading-none tracking-tight lowercase md:text-7xl">
                  a softer way to start the day
                </h1>
                <p className="max-w-xl text-base leading-7 text-muted md:text-lg">
                  Keep your forecast, favorite cities, air quality, astronomy, and little rituals in one calm place.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 lowercase">
                <Link className="rounded-full bg-white/90 px-5 py-3 text-sm shadow-sm transition hover:bg-white" href="/sign-up">
                  create your dashboard
                </Link>
                <Link className="rounded-full border border-white/75 px-5 py-3 text-sm transition hover:bg-white/40" href="/sign-in">
                  i already have an account
                </Link>
              </div>
              <SetupNotice />
            </div>

            <div className="flex items-center justify-center">
              <div className="glass-card w-full max-w-md p-6 md:p-8">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="font-serif text-2xl italic lowercase">little preview</p>
                    <p className="mt-1 text-sm lowercase text-muted">home base first, favorites close behind</p>
                  </div>
                  <PixelSkyMark size={40} />
                </div>
                <div className="space-y-4">
                  <div className="rounded-[1.25rem] border border-white/80 bg-white/55 p-4">
                    <p className="font-serif text-3xl italic lowercase">chicago</p>
                    <p className="mt-1 text-sm lowercase text-muted">58 degrees, partly cloudy, light layers</p>
                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm lowercase text-muted">
                      <span>sunrise 6:12 am</span>
                      <span>air quality good</span>
                      <span>moon waxing crescent</span>
                      <span>wind 12 mph nw</span>
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-[1.25rem] border border-white/80 bg-white/45 p-4">
                      <p className="font-serif text-xl italic lowercase">new york</p>
                      <p className="mt-2 text-sm lowercase text-muted">62 degrees, mostly sunny</p>
                    </div>
                    <div className="rounded-[1.25rem] border border-white/80 bg-white/45 p-4">
                      <p className="font-serif text-xl italic lowercase">seattle</p>
                      <p className="mt-2 text-sm lowercase text-muted">51 degrees, light rain</p>
                    </div>
                  </div>
                </div>
                {!hasClerkConfig() ? (
                  <p className="mt-6 text-xs lowercase text-muted">
                    auth pages are scaffolded and will become live once clerk is configured.
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      </main>
    </GradientBackground>
  );
}
