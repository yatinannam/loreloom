import { useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import TraitSelector from "./TraitSelector";
import TraitSlider from "./TraitSlider";
import AvatarPreview from "./AvatarPreview";
import { SPECIES, ROLES, VIBES, QUIRKS, SLIDERS } from "@/lib/traits";
import type {
  CharacterTraits,
  Species,
  Role,
  Vibe,
  Quirk,
} from "@/lib/types";

interface Props {
  onWeave: (traits: CharacterTraits) => void;
}

export default function CharacterCreator({ onWeave }: Props) {
  const [species, setSpecies] = useState<Species | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [vibe, setVibe] = useState<Vibe | null>(null);
  const [quirk, setQuirk] = useState<Quirk | null>(null);
  const [morality, setMorality] = useState(50);
  const [confidence, setConfidence] = useState(50);
  const [emotionality, setEmotionality] = useState(50);

  const complete = species && role && vibe && quirk;

  const previewTraits: CharacterTraits = useMemo(
    () => ({
      species: species ?? "Human",
      role: role ?? "Explorer",
      vibe: vibe ?? "Mysterious",
      quirk: quirk ?? "Collects strange objects",
      morality,
      confidence,
      emotionality,
    }),
    [species, role, vibe, quirk, morality, confidence, emotionality],
  );

  const chosenCount = [species, role, vibe, quirk].filter(Boolean).length;

  return (
    <div className="mx-auto max-w-5xl px-5 pb-28 pt-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* controls */}
        <div className="order-2 space-y-9 lg:order-1">
          <TraitSelector
            step="I"
            label="Species"
            options={SPECIES}
            value={species}
            onChange={setSpecies}
          />
          <TraitSelector
            step="II"
            label="Class / Role"
            options={ROLES}
            value={role}
            onChange={setRole}
          />
          <TraitSelector
            step="III"
            label="Vibe"
            options={VIBES}
            value={vibe}
            onChange={setVibe}
          />
          <TraitSelector
            step="IV"
            label="Quirk"
            options={QUIRKS}
            value={quirk}
            onChange={setQuirk}
          />

          <div className="animate-rise space-y-5 rounded-3xl border border-white/10 bg-white/[0.02] p-5">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-gold-soft/70">
              Temperament
            </p>
            {SLIDERS.map((s) => {
              const value = { morality, confidence, emotionality }[s.key];
              const setter = {
                morality: setMorality,
                confidence: setConfidence,
                emotionality: setEmotionality,
              }[s.key];
              return (
                <TraitSlider
                  key={s.key}
                  label={s.label}
                  left={s.left}
                  right={s.right}
                  value={value}
                  onChange={setter}
                />
              );
            })}
          </div>
        </div>

        {/* sticky preview */}
        <div className="order-1 lg:order-2">
          <div className="lg:sticky lg:top-6">
            <AvatarPreview traits={previewTraits} />
            <div className="mt-3 flex items-center justify-center gap-2 text-xs text-muted/70">
              {complete ? (
                <span>Every choice reshapes the weave.</span>
              ) : (
                <>
                  <span className="flex gap-1" aria-hidden>
                    {[0, 1, 2, 3].map((i) => (
                      <span
                        key={i}
                        className={`h-1.5 w-1.5 rounded-full ${
                          i < chosenCount ? "bg-gold" : "bg-white/20"
                        }`}
                      />
                    ))}
                  </span>
                  <span>{chosenCount} of 4 chosen</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-ink/85 px-5 py-4 backdrop-blur-lg">
        <div className="mx-auto flex max-w-5xl items-center gap-4">
          <p className="hidden flex-1 text-xs text-muted sm:block">
            {complete
              ? "This is who they appear to be. The story decides the rest."
              : "Choose one Species, Role, Vibe and Quirk to begin."}
          </p>
          <button
            type="button"
            disabled={!complete}
            onClick={() => complete && onWeave(previewTraits)}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gold to-ember px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.2em] text-ink transition enabled:hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-35 sm:flex-none sm:px-10"
          >
            <Sparkles size={16} aria-hidden />
            Begin the story
          </button>
        </div>
      </div>
    </div>
  );
}
