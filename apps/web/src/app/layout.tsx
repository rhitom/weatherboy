import type { Metadata } from "next";
import RootProviders from "@/components/providers/RootProviders";
import "./globals.css";

export const metadata: Metadata = {
  title: "Weatherboy",
  description: "A softer way to start the day",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans antialiased">
        <RootProviders>{children}</RootProviders>
      </body>
    </html>
  );
}
