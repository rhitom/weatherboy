import Link from "next/link";
import { SignUp } from "@clerk/nextjs";
import GradientBackground from "@/components/dashboard/GradientBackground";
import PixelSkyMark from "@/components/branding/PixelSkyMark";
import SetupNotice from "@/components/ui/SetupNotice";
import { hasClerkConfig } from "@/lib/env";

export default function SignUpPage() {
  return (
    <GradientBackground>
      <main className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-8 md:px-8">
        <Link className="flex items-center gap-3 lowercase" href="/">
          <PixelSkyMark size={34} />
          <span className="font-serif text-2xl italic">weatherboy</span>
        </Link>

        <div className="flex flex-1 items-center justify-center">
          <div className="glass-card w-full max-w-md p-6 md:p-8">
            <div className="mb-6 space-y-2 text-center">
              <h1 className="font-serif text-4xl italic lowercase">come on in</h1>
              <p className="text-sm lowercase text-muted">make a dashboard that feels like yours</p>
            </div>
            {hasClerkConfig() ? (
              <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" />
            ) : (
              <div className="space-y-4">
                <SetupNotice />
                <p className="text-sm lowercase text-muted">
                  this route is ready, but clerk keys still need to be added before sign-up can go live.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </GradientBackground>
  );
}
