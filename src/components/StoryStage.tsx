import { ChevronRight, Circle } from "lucide-react";
import type { CharacterGameState, ChoiceOutcome } from "@/game/types";
import { currentScene, availableChoices } from "@/game/engine";
import { TOTAL_CHAPTERS } from "@/game/scenes";
import { topStats } from "@/game/stats";
import { STAT_LABELS } from "@/game/types";

interface Props {
  state: CharacterGameState;
  outcome: ChoiceOutcome | null;
  busy: boolean;
  onChoose: (choiceId: string) => void;
  onContinue: () => void;
}

function ProgressDots({ chapter }: { chapter: number }) {
  return (
    <div className="flex items-center gap-1.5" aria-label={`Chapter ${chapter} of ${TOTAL_CHAPTERS}`}>
      {Array.from({ length: TOTAL_CHAPTERS }).map((_, i) => (
        <span
          key={i}
          className={`h-1.5 rounded-full transition-all ${
            i < chapter ? "w-5 bg-gold" : "w-1.5 bg-white/15"
          }`}
        />
      ))}
    </div>
  );
}

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

export default function StoryStage({
  state,
  outcome,
  busy,
  onChoose,
  onContinue,
}: Props) {
  const scene = currentScene(state);
  const choices = availableChoices(state, scene);
  const top = topStats(state.stats, 3).map((s) => STAT_LABELS[s.key].toLowerCase());
  const instinct = `${top[0]}, ${top[1]}, and ${top[2]}`;

  return (
    <div className="mx-auto max-w-2xl px-5 pb-24 pt-6">
      <div className="flex items-center justify-between">
        <ProgressDots chapter={scene.chapter} />
        <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted/60">
          Chapter {ROMAN[scene.chapter - 1] ?? scene.chapter}
        </span>
      </div>

      <h1 className="mt-7 font-display text-3xl leading-tight text-parchment sm:text-4xl text-balance">
        {scene.title}
      </h1>
      {scene.atmosphere && (
        <p className="mt-2 text-sm italic text-muted/70">{scene.atmosphere}</p>
      )}
      <p className="mt-2 text-[13px] text-muted/50">
        Your instinct still leans on {instinct}.
      </p>

      {!outcome ? (
        <>
          <p className="mt-5 whitespace-pre-line text-[15px] leading-relaxed text-parchment/90">
            {scene.setup}
          </p>

          <div className="mt-7 space-y-3">
            {choices.map((choice) => (
              <button
                key={choice.id}
                type="button"
                disabled={busy}
                onClick={() => onChoose(choice.id)}
                className="group flex w-full items-start gap-3 rounded-2xl border border-white/12 bg-white/[0.03] p-4 text-left transition hover:border-gold/40 hover:bg-white/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold disabled:opacity-40"
              >
                <ChevronRight
                  size={18}
                  aria-hidden
                  className="mt-0.5 shrink-0 text-muted transition group-hover:translate-x-0.5 group-hover:text-gold"
                />
                <span>
                  <span className="block text-[15px] font-medium text-parchment">
                    {choice.label}
                  </span>
                  {choice.description && (
                    <span className="mt-0.5 block text-[13px] leading-snug text-muted">
                      {choice.description}
                    </span>
                  )}
                </span>
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="animate-rise mt-5">
          <p className="whitespace-pre-line text-[15px] leading-relaxed text-parchment/90">
            {outcome.outcomeText}
          </p>

          {outcome.consequenceHints.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-2">
              {outcome.consequenceHints.map((h, i) => (
                <li
                  key={i}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.04] px-3 py-1 text-xs text-muted"
                >
                  <Circle size={7} className="fill-gold text-gold" aria-hidden />
                  {h}
                </li>
              ))}
            </ul>
          )}

          <button
            type="button"
            onClick={onContinue}
            disabled={busy}
            className="mt-7 inline-flex items-center gap-2 rounded-full border border-gold/50 bg-gold/15 px-6 py-3 text-sm font-medium text-gold-soft transition hover:bg-gold/25 disabled:opacity-40"
          >
            {outcome.finished ? "See who you became" : "Continue"}
            <ChevronRight size={16} aria-hidden />
          </button>
        </div>
      )}
    </div>
  );
}
