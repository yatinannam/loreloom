import { useEffect, useState } from "react";
import type { CharacterTraits } from "@/lib/types";

interface Props {
  traits: CharacterTraits;
}

export default function GenerationOverlay({ traits }: Props) {
  const phrases = [
    "Reading between the traits…",
    `Listening to a ${traits.vibe.toLowerCase()} ${traits.species.toLowerCase()}…`,
    "Finding their hidden contradiction…",
    "Giving them something to lose…",
    `Deciding why a ${traits.role.toLowerCase()} ${traits.quirk.toLowerCase()}…`,
    "Weaving their story…",
    "Discovering who they really are…",
  ];
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % phrases.length), 2200);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 bg-ink/85 px-6 backdrop-blur-xl"
      role="status"
      aria-live="polite"
    >
      <div className="relative h-32 w-32">
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-white/10 border-t-gold [animation-duration:2.4s]" />
        <div className="absolute inset-3 animate-spin rounded-full border-2 border-white/5 border-b-arcane [animation-duration:3.6s] [animation-direction:reverse]" />
        <div className="absolute inset-0 flex items-center justify-center font-display text-3xl text-gold animate-orb">
          &#10022;
        </div>
      </div>
      <p className="min-h-[1.5rem] text-center font-display text-lg italic shimmer">
        {phrases[i]}
      </p>
      <p className="text-xs uppercase tracking-[0.3em] text-muted/60">
        Loreloom is weaving
      </p>
    </div>
  );
}
