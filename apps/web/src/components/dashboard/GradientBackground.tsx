"use client";

import { useState } from "react";

function getGradient(hour: number): string {
  if (hour >= 6 && hour < 12) {
    return "linear-gradient(140deg, #FFE7FF 0%, #f8f8ff 38%, #edf4ff 68%, #d8e5ff 100%)";
  }

  if (hour >= 12 && hour < 18) {
    return "linear-gradient(140deg, #f8f8ff 0%, #edf4ff 40%, #dee2ff 72%, #f8f8ff 100%)";
  }

  if (hour >= 18 && hour < 22) {
    return "linear-gradient(145deg, #FFE7FF 0%, #dee2ff 30%, #b8c0ff 68%, #8e97de 100%)";
  }

  return "linear-gradient(145deg, #51579d 0%, #394188 38%, #2a316f 70%, #20285e 100%)";
}

function getTextClass(hour: number): string {
  if (hour >= 22 || hour < 6) return "text-[#d6d8f2]";
  if (hour >= 18) return "text-[#e6e2f2]";
  return "text-foreground";
}

export default function GradientBackground({
  children,
}: {
  children: React.ReactNode;
}) {
  const [hour] = useState(() => new Date().getHours());

  return (
    <div
      className={`min-h-screen transition-all duration-1000 ${getTextClass(hour)}`}
      style={{ background: getGradient(hour) }}
    >
      {children}
    </div>
  );
}
