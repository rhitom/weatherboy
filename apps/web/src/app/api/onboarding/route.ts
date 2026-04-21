import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import type { OnboardingSubmission } from "@weatherboy/shared";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { persistUserPreferences } from "@/lib/preferences-persistence";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { ok: false, message: "Please sign in before saving onboarding." },
        { status: 401 },
      );
    }

    const submission = (await request.json()) as OnboardingSubmission;
    const supabase = createSupabaseAdminClient();

    if (!supabase) {
      return NextResponse.json(
        { ok: false, message: "Supabase is not configured yet. Add the env vars, then try again." },
        { status: 500 },
      );
    }

    await persistUserPreferences(supabase, userId, submission, true);

    return NextResponse.json({
      ok: true,
      message: "Onboarding saved. Taking you to your dashboard.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "Something went wrong while saving onboarding.",
      },
      { status: 500 },
    );
  }
}
