interface FavoriteCityWidgetProps {
  city: string;
  temp: string;
  feelsLike: string;
  condition: string;
  high: string;
  low: string;
  icon: string;
}

export default function FavoriteCityWidget({
  city,
  temp,
  feelsLike,
  condition,
  high,
  low,
  icon,
}: FavoriteCityWidgetProps) {
  return (
    <div className="glass-card p-5 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h3 className="font-serif italic text-lg lowercase">{city}</h3>
        <span className="text-2xl">{icon}</span>
      </div>
      <div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-light">{temp}</span>
          <span className="text-xs text-muted lowercase">feels {feelsLike}</span>
        </div>
        <p className="text-xs text-muted mt-1 lowercase">{condition}</p>
      </div>
      <div className="flex gap-3 text-xs text-muted">
        <span>h: {high}</span>
        <span>l: {low}</span>
      </div>
    </div>
  );
}
