"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { env, hasClerkPublicConfig } from "@/lib/env";

export default function RootProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!hasClerkPublicConfig()) {
    return children;
  }

  return <ClerkProvider publishableKey={env.clerkPublishableKey}>{children}</ClerkProvider>;
}
