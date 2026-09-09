interface Props {
  label: string;
  left: string;
  right: string;
  value: number;
  onChange: (v: number) => void;
}

export default function TraitSlider({ label, left, right, value, onChange }: Props) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="font-display text-base text-parchment">{label}</span>
        <span className="font-mono text-xs text-muted">{value}</span>
      </div>
      <div className="relative">
        <div className="pointer-events-none absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-white/10" />
        <div
          className="pointer-events-none absolute left-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-gradient-to-r from-arcane to-gold"
          style={{ width: `${value}%` }}
        />
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-label={`${label}: ${left} to ${right}`}
          className="relative z-10 h-9 w-full cursor-pointer
            [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-ink
            [&::-webkit-slider-thumb]:bg-gold-soft [&::-webkit-slider-thumb]:shadow-[0_0_16px_-2px_rgba(232,182,76,0.8)]
            [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-ink [&::-moz-range-thumb]:bg-gold-soft"
        />
      </div>
      <div className="mt-0.5 flex justify-between text-[11px] uppercase tracking-wider text-muted/70">
        <span>{left}</span>
        <span>{right}</span>
      </div>
    </div>
  );
}
