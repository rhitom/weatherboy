interface DataPointCardProps {
  label: string;
  value: string;
  sublabel?: string;
  icon: string;
}

export default function DataPointCard({
  label,
  value,
  sublabel,
  icon,
}: DataPointCardProps) {
  return (
    <div className="rounded-2xl bg-white/60 border-[1.5px] border-white/80 p-4 flex flex-col gap-1 text-[#1a1a2e]">
      <div className="flex items-center gap-2">
        <span className="text-lg">{icon}</span>
        <span className="text-xs text-[#5a5f70] lowercase tracking-wide">
          {label}
        </span>
      </div>
      <p className="text-2xl font-light">{value}</p>
      {sublabel && <p className="text-xs text-[#5a5f70]">{sublabel}</p>}
    </div>
  );
}
