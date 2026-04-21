interface AstrologyCardProps {
  sign: string;
  horoscope: string;
  mood: string;
  luckyNumber: string;
  luckyColor: string;
  moonPhase: string;
  onHide?: () => void;
}

export default function AstrologyCard({
  sign,
  horoscope,
  mood,
  luckyNumber,
  luckyColor,
  moonPhase,
  onHide,
}: AstrologyCardProps) {
  return (
    <div className="relative rounded-2xl bg-gradient-to-br from-indigo-50/90 to-purple-50/90 border-[1.5px] border-white/80 p-4 mt-4 text-[#1a1a2e]">
      {onHide && (
        <button
          onClick={onHide}
          className="absolute top-3 right-3 text-xs text-[#5a5f70] hover:text-[#1a1a2e] transition-colors"
        >
          hide
        </button>
      )}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">&#9734;</span>
        <h3 className="font-serif italic text-base">{sign}</h3>
        <span className="text-xs text-[#5a5f70] ml-auto">{moonPhase}</span>
      </div>
      <p className="text-sm leading-relaxed mb-3">{horoscope}</p>
      <div className="flex gap-4 text-xs text-[#5a5f70]">
        <span>
          mood: <span className="text-[#1a1a2e]">{mood}</span>
        </span>
        <span>
          lucky #: <span className="text-[#1a1a2e]">{luckyNumber}</span>
        </span>
        <span>
          color: <span className="text-[#1a1a2e]">{luckyColor}</span>
        </span>
      </div>
    </div>
  );
}
