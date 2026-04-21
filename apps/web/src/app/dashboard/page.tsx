import Link from "next/link";
import GradientBackground from "@/components/dashboard/GradientBackground";
import HomeBaseCard from "@/components/dashboard/HomeBaseCard";
import FavoriteCityWidget from "@/components/dashboard/FavoriteCityWidget";
import SetupNotice from "@/components/ui/SetupNotice";
import { prototypeDashboardData } from "@/lib/dashboard-data";

export default function DashboardPage() {
  const dashboard = prototypeDashboardData;

  return (
    <GradientBackground>
      <main className="mx-auto max-w-[1400px] px-4 py-8 md:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="font-serif text-2xl italic lowercase">weatherboy</h2>
          <div className="flex items-center gap-4">
            <Link className="text-sm lowercase text-muted transition-colors hover:text-foreground" href="/settings">
              settings
            </Link>
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/60 bg-white/50 text-sm">
              W
            </div>
          </div>
        </div>

        <div className="mb-6">
          <SetupNotice />
          <p className="mt-3 text-sm lowercase text-muted">
            dashboard is temporarily pinned to the prototype view while the live data path is being stabilized.
          </p>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="lg:w-3/4">
            <HomeBaseCard {...dashboard.homeBase} />
          </div>

          <div className="flex flex-col gap-4 lg:w-1/4">
            <h2 className="font-serif text-lg italic lowercase opacity-70">your cities</h2>
            {dashboard.favorites.map((favorite) => (
              <FavoriteCityWidget key={favorite.city} {...favorite} />
            ))}
          </div>
        </div>
      </main>
    </GradientBackground>
  );
}
