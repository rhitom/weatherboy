import GradientBackground from "@/components/dashboard/GradientBackground";
import OnboardingFlow from "@/components/onboarding/OnboardingFlow";
import SetupNotice from "@/components/ui/SetupNotice";

export default function OnboardingPage() {
  return (
    <GradientBackground>
      <main className="mx-auto min-h-screen max-w-7xl px-4 py-8 md:px-8">
        <div className="mb-8 max-w-2xl space-y-3">
          <p className="text-sm lowercase text-muted">set up once, settle in later</p>
          <h1 className="font-serif text-5xl italic lowercase">build your weatherboy</h1>
          <p className="text-sm lowercase text-muted">
            choose your home base, pick the details you care about, and decide how much moonlight you want in the mix.
          </p>
          <SetupNotice />
        </div>
        <OnboardingFlow />
      </main>
    </GradientBackground>
  );
}
