import { useState, type ReactNode } from "react";
import {
  Bookmark,
  BookmarkCheck,
  Share2,
  RotateCcw,
  Sparkles,
  ChevronDown,
  Wand2,
  Hammer,
} from "lucide-react";
import AvatarPreview from "./AvatarPreview";
import { useToast } from "./Toast";
import { shareRun } from "@/lib/share";
import type { CharacterGameState, Rarity } from "@/game/types";
import { STAT_KEYS, HIDDEN_KEYS, STAT_LABELS } from "@/game/types";

const RARITY_STYLE: Record<Rarity, string> = {
  Common: "border-white/20 text-muted",
  Uncommon: "border-teal/40 text-teal",
  Rare: "border-arcane/50 text-arcane",
  Epic: "border-gold/50 text-gold-soft",
  Legendary: "border-ember/60 text-ember",
};

const HIDDEN_LABELS: Record<string, string> = {
  loyalty: "Loyalty",
  selflessness: "Selflessness",
  ruthlessness: "Ruthlessness",
  integrity: "Integrity",
  attachment: "Attachment",
  risk: "Appetite for risk",
  sacrifice: "Willingness to sacrifice",
  betrayal: "Willingness to betray",
};

interface Props {
  state: CharacterGameState;
  saved: boolean;
  readOnly?: boolean;
  onSave: () => void;
  onReplayCharacter: () => void;
  onNewCharacter: () => void;
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

function Meter({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-[13px]">
        <span className="text-parchment/90">{label}</span>
        <span className="font-mono text-muted">{value}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-arcane to-gold"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export default function FinalReveal({
  state,
  saved,
  readOnly,
  onSave,
  onReplayCharacter,
  onNewCharacter,
}: Props) {
  const [showLedger, setShowLedger] = useState(false);
  const toast = useToast();
  const card = state.finalCard;
  const ending = state.ending;
  const t = state.initialTraits;

  if (!card || !ending) return null;

  async function handleShare() {
    const result = await shareRun(state);
    if (result === "copied") toast("Character card copied to clipboard");
    else if (result === "shared") toast("Shared");
    else toast("Couldn't share on this device");
  }

  return (
    <div className="mx-auto max-w-2xl px-5 pb-28 pt-10 sm:pt-14">
      <header className="animate-rise text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-muted/60">
          {t.vibe} {t.species} {t.role} · {card.alignment}
        </p>
        <h1 className="mt-3 font-display text-4xl leading-tight text-parchment sm:text-5xl text-balance">
          {card.name}
        </h1>
        <p className="mt-2 font-display text-lg italic text-gold-soft">
          {card.archetypeTitle}
        </p>
        <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-muted text-balance">
          {card.openingLine}
          <br />
          <span className="text-parchment/90">{card.becameLine}</span>
        </p>
        <span
          className={`mt-4 inline-block rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.25em] ${RARITY_STYLE[card.rarity]}`}
        >
          {card.rarity}
        </span>
      </header>

      <div
        className="animate-rise mx-auto mt-8 max-w-sm overflow-hidden rounded-[26px]"
        style={{
          boxShadow: `inset 0 0 0 1px ${card.palette.accent}55, 0 0 40px -10px ${card.palette.accent}66`,
        }}
      >
        <AvatarPreview traits={t} />
      </div>

      <div className="mt-8 space-y-6">
        <Section title="Core traits">
          <div className="space-y-3">
            {card.coreStats.map((s) => (
              <Meter key={s.key} label={s.label} value={s.value} />
            ))}
          </div>
        </Section>

        <Section title="Signature">
          <p className="text-[15px] leading-relaxed text-parchment/90">
            {card.signature}
          </p>
        </Section>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="animate-rise rounded-2xl border border-teal/25 bg-teal/5 p-4">
            <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.25em] text-teal/80">
              Strength
            </p>
            <p className="text-sm text-parchment/90">{card.strength}</p>
          </div>
          <div className="animate-rise rounded-2xl border border-ember/25 bg-ember/5 p-4">
            <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.25em] text-ember/80">
              Flaw
            </p>
            <p className="text-sm text-parchment/90">{card.flaw}</p>
          </div>
        </div>

        <Section title="Legacy">
          <p className="text-[15px] leading-relaxed text-parchment/90">
            {card.legacy}
          </p>
          {card.epilogue && (
            <p className="mt-3 text-[15px] italic leading-relaxed text-muted">
              {card.epilogue}
            </p>
          )}
          <p className="mt-3 inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-muted/60">
            {card.source === "claude" ? (
              <>
                <Wand2 size={12} aria-hidden /> Refined with Claude
              </>
            ) : (
              <>
                <Hammer size={12} aria-hidden /> Forged by Loreloom
              </>
            )}
          </p>
        </Section>

        <Section title={`Ending · ${ending.title}`}>
          <p className="text-[15px] leading-relaxed text-parchment/90">
            {ending.narrative}
          </p>
        </Section>

        <Section title="The path you took">
          <ol className="space-y-2">
            {state.decisions.map((d, i) => (
              <li key={i} className="flex gap-3 text-[13px]">
                <span className="font-mono text-muted/50">{i + 1}</span>
                <span className="text-parchment/85">
                  <span className="text-muted">{d.sceneTitle} — </span>
                  {d.choiceLabel}
                </span>
              </li>
            ))}
          </ol>
        </Section>

        <Section title="The full ledger">
          <button
            type="button"
            onClick={() => setShowLedger((v) => !v)}
            aria-expanded={showLedger}
            className="flex w-full items-center justify-between rounded-xl border border-white/12 bg-white/[0.03] px-4 py-3 text-sm text-muted transition hover:border-white/25 hover:text-parchment"
          >
            <span>Everything the story measured</span>
            <ChevronDown
              size={16}
              aria-hidden
              className={`transition-transform ${showLedger ? "rotate-180" : ""}`}
            />
          </button>
          {showLedger && (
            <div className="animate-rise mt-3 grid gap-x-6 gap-y-3 rounded-xl border border-arcane/20 bg-arcane/5 p-4 sm:grid-cols-2">
              {STAT_KEYS.map((k) => (
                <Meter key={k} label={STAT_LABELS[k]} value={state.stats[k]} />
              ))}
              {HIDDEN_KEYS.map((k) => (
                <Meter key={k} label={HIDDEN_LABELS[k] ?? k} value={state.hidden[k]} />
              ))}
            </div>
          )}
        </Section>
      </div>

      {!readOnly && (
        <div className="sticky bottom-4 z-20 mt-10 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onSave}
            disabled={saved}
            className={`flex-1 inline-flex items-center justify-center gap-2 rounded-full border px-5 py-3.5 text-sm font-medium transition ${
              saved
                ? "cursor-default border-teal/30 bg-teal/10 text-teal"
                : "border-gold/50 bg-gold/15 text-gold-soft hover:bg-gold/25"
            }`}
          >
            {saved ? <BookmarkCheck size={16} aria-hidden /> : <Bookmark size={16} aria-hidden />}
            {saved ? "Saved" : "Save card"}
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-5 py-3.5 text-sm font-medium text-parchment transition hover:border-white/30 hover:bg-white/[0.08]"
          >
            <Share2 size={16} aria-hidden />
            Share
          </button>
        </div>
      )}

      <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
        <button
          type="button"
          onClick={onReplayCharacter}
          className="inline-flex items-center gap-2 text-gold-soft underline-offset-4 transition hover:underline"
        >
          <RotateCcw size={15} aria-hidden />
          Play this character again
        </button>
        <button
          type="button"
          onClick={onNewCharacter}
          className="inline-flex items-center gap-2 text-muted underline-offset-4 transition hover:text-parchment hover:underline"
        >
          <Sparkles size={15} aria-hidden />
          Create a new character
        </button>
      </div>
    </div>
  );
}
