import type { TraitMeta } from "@/lib/traits";

interface Props<T extends string> {
  label: string;
  step: string;
  options: TraitMeta<T>[];
  value: T | null;
  onChange: (v: T) => void;
}

export default function TraitSelector<T extends string>({
  label,
  step,
  options,
  value,
  onChange,
}: Props<T>) {
  return (
    <fieldset className="animate-rise">
      <legend className="mb-3 flex items-baseline gap-3">
        <span className="font-mono text-xs tracking-[0.3em] text-gold-soft/70">
          {step}
        </span>
        <span className="font-display text-xl text-parchment">{label}</span>
      </legend>
      <div
        role="radiogroup"
        aria-label={label}
        className="grid grid-cols-2 gap-2 sm:grid-cols-3"
      >
        {options.map((opt) => {
          const active = opt.value === value;
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(opt.value)}
              className={`group relative flex min-h-[64px] flex-col items-start justify-center gap-0.5 rounded-2xl border px-3.5 py-2.5 text-left transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${
                active
                  ? "border-transparent bg-white/[0.07] chip-glow"
                  : "border-white/10 bg-white/[0.02] hover:border-white/25 hover:bg-white/[0.05]"
              }`}
            >
              <span className="flex items-center gap-2">
                <span
                  aria-hidden
                  className={`text-base ${active ? "text-gold" : "text-muted group-hover:text-parchment"}`}
                >
                  {opt.glyph}
                </span>
                <span className="text-sm font-medium leading-tight text-parchment">
                  {opt.value}
                </span>
              </span>
              <span className="pl-6 text-[11px] uppercase tracking-wider text-muted/70">
                {opt.hint}
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
