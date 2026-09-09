import { useState, type ReactNode } from "react";
import AvatarPreview from "./AvatarPreview";
import { useToast } from "./Toast";
import { shareCharacter } from "@/lib/share";
import type { CharacterTraits, GeneratedCharacter } from "@/lib/types";

interface Props {
  traits: CharacterTraits;
  character: GeneratedCharacter;
  saved: boolean;
  onSave: () => void;
  onWeaveAnother: () => void;
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="animate-rise border-t border-white/10 pt-5">
      <h2 className="mb-2 font-mono text-xs uppercase tracking-[0.3em] text-gold-soft/70">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Chips({
  items,
  tone,
}: {
  items: string[];
  tone: "good" | "bad" | "neutral";
}) {
  const styles = {
    good: "border-teal/30 bg-teal/10 text-teal",
    bad: "border-ember/30 bg-ember/10 text-ember",
    neutral: "border-white/12 bg-white/5 text-parchment",
  }[tone];
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((it, idx) => (
        <li
          key={idx}
          className={`rounded-xl border px-3 py-1.5 text-sm ${styles}`}
        >
          {it}
        </li>
      ))}
    </ul>
  );
}

export default function CharacterReveal({
  traits,
  character,
  saved,
  onSave,
  onWeaveAnother,
}: Props) {
  const [showVisual, setShowVisual] = useState(false);
  const toast = useToast();

  async function handleShare() {
    const result = await shareCharacter(character, traits);
    if (result === "copied") toast("Character summary copied to clipboard");
    else if (result === "shared") toast("Shared");
    else toast("Couldn't share on this device");
  }

  return (
    <div className="mx-auto max-w-2xl px-5 pb-24 pt-10 sm:pt-16">
      <header className="animate-rise text-center">
        <p className="font-mono text-xs uppercase tracking-[0.4em] text-muted/60">
          {traits.vibe} {traits.species} {traits.role}
        </p>
        <h1 className="mt-3 font-display text-4xl leading-tight text-parchment sm:text-5xl text-balance">
          {character.name}
        </h1>
        <p className="mt-2 font-display text-lg italic text-gold-soft">
          {character.title}
        </p>
        <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-muted text-balance">
          &ldquo;{character.oneLiner}&rdquo;
        </p>
      </header>

      <div className="animate-rise mx-auto mt-8 max-w-sm">
        <AvatarPreview traits={traits} />
      </div>

      <div className="mt-8 space-y-6">
        <Section title="Personality">
          <p className="text-[15px] leading-relaxed text-parchment/90">
            {character.personality}
          </p>
        </Section>

        <Section title="Origin">
          <p className="text-[15px] leading-relaxed text-parchment/90">
            {character.backstory}
          </p>
        </Section>

        <Section title="What drives them">
          <p className="text-[15px] leading-relaxed text-parchment/90">
            {character.motivation}
          </p>
        </Section>

        <Section title="Strengths">
          <Chips items={character.strengths} tone="good" />
        </Section>

        <Section title="Flaws">
          <Chips items={character.flaws} tone="bad" />
        </Section>

        <Section title="Little things">
          <Chips items={character.quirks} tone="neutral" />
        </Section>

        <Section title="Relationships">
          <p className="text-[15px] leading-relaxed text-parchment/90">
            {character.relationships}
          </p>
        </Section>

        <Section title="Visual DNA">
          <button
            type="button"
            onClick={() => setShowVisual((v) => !v)}
            aria-expanded={showVisual}
            className="flex w-full items-center justify-between rounded-xl border border-white/12 bg-white/[0.03] px-4 py-3 text-sm text-muted transition hover:border-white/25 hover:text-parchment"
          >
            <span>Illustration brief for this character</span>
            <span aria-hidden>{showVisual ? "–" : "+"}</span>
          </button>
          {showVisual && (
            <p className="animate-rise mt-3 rounded-xl border border-arcane/20 bg-arcane/5 p-4 text-[14px] leading-relaxed text-parchment/85">
              {character.visualDescription}
            </p>
          )}
        </Section>
      </div>

      <div className="sticky bottom-4 z-20 mt-10 flex gap-3">
        <button
          type="button"
          onClick={onSave}
          disabled={saved}
          className={`flex-1 rounded-full border px-5 py-3.5 text-sm font-medium transition ${
            saved
              ? "cursor-default border-teal/30 bg-teal/10 text-teal"
              : "border-gold/50 bg-gold/15 text-gold-soft hover:bg-gold/25"
          }`}
        >
          {saved ? "✓ Saved to collection" : "Save character"}
        </button>
        <button
          type="button"
          onClick={handleShare}
          className="flex-1 rounded-full border border-white/15 bg-white/[0.04] px-5 py-3.5 text-sm font-medium text-parchment transition hover:border-white/30 hover:bg-white/[0.08]"
        >
          Share character
        </button>
      </div>

      <button
        type="button"
        onClick={onWeaveAnother}
        className="mx-auto mt-6 block text-sm text-muted underline-offset-4 transition hover:text-parchment hover:underline"
      >
        ← Weave another character
      </button>
    </div>
  );
}
