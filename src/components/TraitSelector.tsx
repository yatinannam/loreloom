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
      <legend className="mb-3.5 flex items-baseline gap-3">
        <span className="font-display text-sm text-gold-soft/60">{step}</span>
        <span className="font-display text-xl text-parchment">{label}</span>
      </legend>
      <div
        role="radiogroup"
        aria-label={label}
        className="grid grid-cols-2 gap-2.5 sm:grid-cols-3"
      >
        {options.map((opt) => {
          const active = opt.value === value;
          const Icon = opt.icon;
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(opt.value)}
              className={`group flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${
                active
                  ? "border-gold/55 bg-gold/[0.07]"
                  : "border-white/10 bg-white/[0.02] hover:border-white/25 hover:bg-white/[0.04]"
              }`}
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                  active
                    ? "border-gold/40 bg-gold/10 text-gold"
                    : "border-white/10 bg-white/[0.03] text-muted group-hover:text-parchment"
                }`}
              >
                <Icon size={16} aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-[14px] leading-tight text-parchment">
                  {opt.value}
                </span>
                <span className="block truncate text-xs leading-tight text-muted/70">
                  {opt.hint}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
