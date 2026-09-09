import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface Props {
  phrases: string[];
  label?: string;
}

export default function GenerationOverlay({ phrases, label = "Weaving" }: Props) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (phrases.length <= 1) return;
    const t = setInterval(() => setI((v) => (v + 1) % phrases.length), 2100);
    return () => clearInterval(t);
  }, [phrases.length]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 bg-ink/90 px-6 backdrop-blur-xl"
      role="status"
      aria-live="polite"
    >
      <div className="relative h-28 w-28">
        <div className="absolute inset-0 animate-spin rounded-full border border-white/10 border-t-gold [animation-duration:2.4s]" />
        <div className="absolute inset-4 animate-spin rounded-full border border-white/5 border-b-arcane [animation-duration:3.6s] [animation-direction:reverse]" />
        <div className="absolute inset-0 flex items-center justify-center text-gold">
          <Loader2 size={26} className="animate-spin [animation-duration:1.6s]" aria-hidden />
        </div>
      </div>
      <p className="min-h-[1.75rem] max-w-sm text-center font-display text-lg italic shimmer">
        {phrases[i]}
      </p>
      <p className="text-xs uppercase tracking-[0.3em] text-muted/60">{label}</p>
    </div>
  );
}
