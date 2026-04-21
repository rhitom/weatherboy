"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { hasClerkConfig } from "@/lib/env";

export default function RootProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!hasClerkConfig()) {
    return children;
  }

  return <ClerkProvider>{children}</ClerkProvider>;
}
