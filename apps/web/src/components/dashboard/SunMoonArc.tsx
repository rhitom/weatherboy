"use client";

interface ArcProps {
  label: string;
  riseTime: string;
  setTime: string;
  progress: number; // 0 to 1, where on the arc the body currently is
  color: string;
  glowColor: string;
  icon: string;
}

export default function SunMoonArc({
  label,
  riseTime,
  setTime,
  progress,
  color,
  glowColor,
  icon,
}: ArcProps) {
  // Arc geometry: semicircle from left to right
  const width = 280;
  const height = 100;
  const padX = 30;
  const padY = 20;
  const arcW = width - padX * 2;
  const arcH = height - padY - 10;
  const centerX = width / 2;
  const centerY = height - padY;
  const radiusX = arcW / 2;
  const radiusY = arcH;

  // Calculate dot position along the arc (0=left, 1=right)
  const clampedProgress = Math.max(0, Math.min(1, progress));
  const angle = Math.PI * (1 - clampedProgress); // pi to 0
  const dotX = centerX + radiusX * Math.cos(angle);
  const dotY = centerY - radiusY * Math.sin(angle);

  // Arc path (semicircle from left to right)
  const startX = centerX - radiusX;
  const endX = centerX + radiusX;

  return (
    <div className="flex flex-col items-center">
      <p className="font-serif text-sm italic mb-1 opacity-70">{label}</p>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        className="overflow-visible"
      >
        {/* Dashed arc path */}
        <path
          d={`M ${startX} ${centerY} A ${radiusX} ${radiusY} 0 0 1 ${endX} ${centerY}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          opacity={0.3}
        />

        {/* Progress arc (filled portion) */}
        {clampedProgress > 0 && (
          <path
            d={`M ${startX} ${centerY} A ${radiusX} ${radiusY} 0 0 1 ${dotX} ${dotY}`}
            fill="none"
            stroke={color}
            strokeWidth="2"
            opacity={0.6}
          />
        )}

        {/* Glow behind dot */}
        <circle cx={dotX} cy={dotY} r="12" fill={glowColor} opacity={0.3} />

        {/* Dot */}
        <circle cx={dotX} cy={dotY} r="5" fill={color} />

        {/* Icon text at dot */}
        <text
          x={dotX}
          y={dotY - 14}
          textAnchor="middle"
          fontSize="14"
          className="select-none"
        >
          {icon}
        </text>

        {/* Rise time label */}
        <text
          x={startX}
          y={centerY + 16}
          textAnchor="middle"
          fontSize="11"
          fill="currentColor"
          opacity={0.6}
          className="font-sans"
        >
          {riseTime}
        </text>

        {/* Set time label */}
        <text
          x={endX}
          y={centerY + 16}
          textAnchor="middle"
          fontSize="11"
          fill="currentColor"
          opacity={0.6}
          className="font-sans"
        >
          {setTime}
        </text>
      </svg>
    </div>
  );
}
