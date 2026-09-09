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
import EarnedCard from "./EarnedCard";
import { useToast } from "./Toast";
import { shareRun } from "@/lib/share";
import type { CharacterGameState } from "@/game/types";
import { STAT_KEYS, HIDDEN_KEYS, STAT_LABELS } from "@/game/types";

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

/** A titled block. The title sits inline with a hairline that runs to the edge —
    it reads as a chapter mark, not a form label. */
function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-9 first:mt-0">
      <div className="mb-3 flex items-center gap-3">
        <h2 className="font-display text-lg italic text-gold-soft">{title}</h2>
        <span className="h-px flex-1 bg-white/12" />
      </div>
      {children}
    </section>
  );
}

function Meter({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between text-[13px]">
        <span className="text-parchment/90">{label}</span>
        <span className="tabular-nums text-muted">{value}</span>
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-white/10">
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

  if (!card || !ending) return null;

  async function handleShare() {
    const result = await shareRun(state);
    if (result === "copied") toast("Character card copied to clipboard");
    else if (result === "shared") toast("Shared");
    else toast("Couldn't share on this device");
  }

  return (
    <div className="mx-auto max-w-2xl px-5 pb-28 pt-8 sm:pt-12">
      <div className="mx-auto max-w-sm">
        <EarnedCard state={state} variant="hero" />
      </div>

      <div className="mt-10">
        <Block title="Signature">
          <p className="text-[15px] leading-relaxed text-parchment/90">
            {card.signature}
          </p>
        </Block>

        <Block title="What it cost you, what it bought">
          <div className="divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/12">
            <div className="flex gap-4 p-4">
              <span className="w-16 shrink-0 pt-0.5 font-display text-sm italic text-teal">
                Kept
              </span>
              <p className="text-sm leading-relaxed text-parchment/90">
                {card.strength}
              </p>
            </div>
            <div className="flex gap-4 p-4">
              <span className="w-16 shrink-0 pt-0.5 font-display text-sm italic text-ember">
                Lost
              </span>
              <p className="text-sm leading-relaxed text-parchment/90">
                {card.flaw}
              </p>
            </div>
          </div>
        </Block>

        <Block title="Legacy">
          <p className="text-[15px] leading-relaxed text-parchment/90">
            {card.legacy}
          </p>
          {card.epilogue && (
            <p className="mt-3 text-[15px] italic leading-relaxed text-muted">
              {card.epilogue}
            </p>
          )}
          <p className="mt-4 inline-flex items-center gap-1.5 text-xs text-muted/60">
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
        </Block>

        <Block title={ending.title}>
          <p className="text-[15px] leading-relaxed text-parchment/90">
            {ending.narrative}
          </p>
        </Block>

        <Block title="The path you took">
          <ol className="space-y-2.5">
            {state.decisions.map((d, i) => (
              <li key={i} className="flex gap-3 text-[13px] leading-snug">
                <span className="tabular-nums text-muted/40">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-parchment/85">
                  <span className="text-muted">{d.sceneTitle} — </span>
                  {d.choiceLabel}
                </span>
              </li>
            ))}
          </ol>
        </Block>

        <Block title="The full ledger">
          <button
            type="button"
            onClick={() => setShowLedger((v) => !v)}
            aria-expanded={showLedger}
            className="flex w-full items-center justify-between rounded-xl border border-white/12 bg-white/[0.03] px-4 py-3 text-sm text-muted transition hover:border-white/25 hover:text-parchment"
          >
            <span>Every stat the story measured</span>
            <ChevronDown
              size={16}
              aria-hidden
              className={`transition-transform ${showLedger ? "rotate-180" : ""}`}
            />
          </button>
          {showLedger && (
            <div className="mt-3 grid gap-x-6 gap-y-3 rounded-xl border border-white/12 bg-white/[0.02] p-4 sm:grid-cols-2">
              {STAT_KEYS.map((k) => (
                <Meter key={k} label={STAT_LABELS[k]} value={state.stats[k]} />
              ))}
              {HIDDEN_KEYS.map((k) => (
                <Meter key={k} label={HIDDEN_LABELS[k] ?? k} value={state.hidden[k]} />
              ))}
            </div>
          )}
        </Block>
      </div>

      {!readOnly && (
        <div className="sticky bottom-4 z-20 mt-10 flex gap-3">
          <button
            type="button"
            onClick={onSave}
            disabled={saved}
            className={`inline-flex flex-1 items-center justify-center gap-2 rounded-full border px-5 py-3.5 text-sm font-medium transition ${
              saved
                ? "cursor-default border-teal/30 bg-teal/10 text-teal"
                : "border-gold/50 bg-gold/15 text-gold-soft hover:bg-gold/25"
            }`}
          >
            {saved ? (
              <BookmarkCheck size={16} aria-hidden />
            ) : (
              <Bookmark size={16} aria-hidden />
            )}
            {saved ? "Saved to collection" : "Save card"}
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-5 py-3.5 text-sm font-medium text-parchment transition hover:border-white/30 hover:bg-white/[0.08]"
          >
            <Share2 size={16} aria-hidden />
            Share
          </button>
        </div>
      )}

      <div className="mt-6 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm">
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
