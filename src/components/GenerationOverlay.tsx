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
      <div className="relative flex h-24 w-24 items-center justify-center">
        <div className="absolute inset-0 animate-spin rounded-full border border-white/10 border-t-gold [animation-duration:2.4s]" />
        <Loader2 size={24} className="animate-spin text-gold [animation-duration:1.6s]" aria-hidden />
      </div>
      <p className="min-h-[1.75rem] max-w-sm text-center font-display text-lg italic shimmer">
        {phrases[i]}
      </p>
      <p className="text-sm italic text-muted/60">{label}</p>
    </div>
  );
}
