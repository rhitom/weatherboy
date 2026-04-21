"use client";

import { useEffect } from "react";
import Link from "next/link";
import GradientBackground from "@/components/dashboard/GradientBackground";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard route error:", error);
  }, [error]);

  return (
    <GradientBackground>
      <main className="mx-auto min-h-screen max-w-3xl px-4 py-12 md:px-8">
        <div className="glass-card space-y-4 p-8">
          <p className="text-sm lowercase text-muted">dashboard hit an error</p>
          <h1 className="font-serif text-4xl italic lowercase">the page did not finish loading</h1>
          <p className="text-sm lowercase text-muted">
            {error.message || "unknown dashboard error"}
          </p>
          {error.digest ? (
            <p className="text-xs lowercase text-muted">digest: {error.digest}</p>
          ) : null}
          <div className="flex flex-wrap gap-3">
            <button
              className="rounded-full bg-white/90 px-5 py-3 text-sm lowercase shadow-sm transition hover:bg-white"
              type="button"
              onClick={reset}
            >
              try again
            </button>
            <Link
              className="rounded-full border border-white/70 px-5 py-3 text-sm lowercase transition hover:bg-white/35"
              href="/"
            >
              go home
            </Link>
          </div>
        </div>
      </main>
    </GradientBackground>
  );
}
