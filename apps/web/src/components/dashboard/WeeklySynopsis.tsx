interface WeeklySynopsisProps {
  synopsis: string;
}

export default function WeeklySynopsis({ synopsis }: WeeklySynopsisProps) {
  return (
    <div className="mt-4 rounded-2xl bg-white/60 border-[1.5px] border-white/80 p-4 text-[#1a1a2e]">
      <h3 className="font-serif italic text-sm mb-2 opacity-70">
        your week ahead
      </h3>
      <p className="text-sm leading-relaxed">{synopsis}</p>
    </div>
  );
}
