export default function PixelSkyMark({
  size = 56,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  const unit = size / 16;

  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 16 16"
      width={size}
      height={size}
      fill="none"
    >
      <rect x={1 * unit} y={6 * unit} width={9 * unit} height={4 * unit} rx={unit} fill="#f8f8ff" />
      <rect x={3 * unit} y={4 * unit} width={4 * unit} height={3 * unit} rx={unit} fill="#f8f8ff" />
      <rect x={8 * unit} y={5 * unit} width={3 * unit} height={3 * unit} rx={unit} fill="#edf4ff" />
      <rect x={10.5 * unit} y={2 * unit} width={3 * unit} height={3 * unit} rx={unit} fill="#FFE7FF" />
      <rect x={11.5 * unit} y={2.75 * unit} width={1.5 * unit} height={1.5 * unit} rx={unit / 2} fill="#d8e5ff" />
      <rect x={13 * unit} y={4.75 * unit} width={1 * unit} height={1 * unit} fill="#dee2ff" />
      <rect x={12.5 * unit} y={5.25 * unit} width={2 * unit} height={0.5 * unit} fill="#dee2ff" />
      <rect x={13.25 * unit} y={4.5 * unit} width={0.5 * unit} height={2 * unit} fill="#dee2ff" />
    </svg>
  );
}
