import { useCallback, useRef, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import CharacterCreator from "@/components/CharacterCreator";
import GenerationOverlay from "@/components/GenerationOverlay";
import StoryStage from "@/components/StoryStage";
import FinalReveal from "@/components/FinalReveal";
import AvatarPreview from "@/components/AvatarPreview";
import { useToast } from "@/components/Toast";
import { SEED_RUNS } from "@/lib/seeds";
import { saveRun, isRunSaved } from "@/lib/storage";
import { useSavedRuns } from "@/lib/useSaved";
import { requestEnhancement } from "@/lib/enhance";
import { startGame, applyChoice } from "@/game/engine";
import { withEnhancement } from "@/game/card";
import { INTRO } from "@/game/scenes";
import type { CharacterTraits } from "@/lib/types";
import type { CharacterGameState, ChoiceOutcome } from "@/game/types";

type View = "landing" | "create" | "intro" | "play" | "calculating" | "reveal";

const CALC_PHRASES = [
  "Reading back every choice you made…",
  "Finding the contradiction you lived with…",
  "Weighing what you were willing to lose…",
  "Deciding who the story turned you into…",
  "Setting the last word in stone…",
];

export default function Home() {
  const [view, setView] = useState<View>("landing");
  const [game, setGame] = useState<CharacterGameState | null>(null);
  const [outcome, setOutcome] = useState<ChoiceOutcome | null>(null);
  const [saved, setSaved] = useState(false);
  const busy = useRef(false);
  const toast = useToast();
  const savedCount = useSavedRuns().length;

  const begin = useCallback((traits: CharacterTraits) => {
    setGame(startGame(traits));
    setOutcome(null);
    setSaved(false);
    setView("intro");
  }, []);

  const choose = useCallback(
    (choiceId: string) => {
      if (busy.current || !game || outcome) return;
      busy.current = true;
      try {
        const result = applyChoice(game, choiceId);
        setGame(result.state);
        setOutcome(result.outcome);
      } finally {
        busy.current = false;
      }
    },
    [game, outcome],
  );

  const finishRun = useCallback(async (finished: CharacterGameState) => {
    setView("calculating");
    const startedAt = Date.now();
    const enh = await requestEnhancement(finished);
    let final = finished;
    if (enh) {
      final = { ...finished, finalCard: withEnhancement(finished, enh) };
    }
    const elapsed = Date.now() - startedAt;
    if (elapsed < 1900) await new Promise((r) => setTimeout(r, 1900 - elapsed));
    setGame(final);
    setSaved(isRunSaved(final.id));
    setOutcome(null);
    setView("reveal");
    if (typeof window !== "undefined") window.scrollTo({ top: 0 });
  }, []);

  const continueStory = useCallback(() => {
    if (!game || !outcome) return;
    if (outcome.finished) {
      void finishRun(game);
    } else {
      setOutcome(null);
      if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [game, outcome, finishRun]);

  const handleSave = useCallback(() => {
    if (!game || saved) return;
    saveRun(game);
    setSaved(true);
    toast("Card woven into your collection");
  }, [game, saved, toast]);

  const replayCharacter = useCallback(() => {
    if (!game) return;
    setGame(startGame(game.initialTraits, game.seed));
    setOutcome(null);
    setSaved(false);
    setView("intro");
  }, [game]);

  const newCharacter = useCallback(() => {
    setGame(null);
    setOutcome(null);
    setSaved(false);
    setView("create");
  }, []);

  return (
    <>
      <Head>
        <title>Loreloom — Choose who you appear to be. Discover who you become.</title>
      </Head>

      {view === "calculating" && <GenerationOverlay phrases={CALC_PHRASES} label="Calculating your story" />}

      {view !== "reveal" && <SiteHeader savedCount={savedCount} active="create" />}

      {view === "landing" && (
        <main className="mx-auto flex min-h-[calc(100dvh-64px)] max-w-3xl flex-col items-center justify-center px-6 py-16 text-center">
          <p className="animate-rise font-mono text-xs uppercase tracking-[0.5em] text-gold-soft/70">
            An interactive character game
          </p>
          <h1 className="animate-rise mt-5 font-display text-6xl leading-[0.95] text-parchment sm:text-8xl">
            LORELOOM
          </h1>
          <p className="animate-rise mt-6 font-display text-xl italic text-gold-soft sm:text-2xl">
            Weave a character.
            <br />
            Discover their story.
          </p>
          <p className="animate-rise mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-muted text-balance">
            Choose who your character appears to be. Then play through a short
            story where every choice bends them. The character you walk away with
            is one you earned.
          </p>
          <button
            type="button"
            onClick={() => setView("create")}
            className="animate-rise mt-9 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gold to-ember px-9 py-4 text-sm font-semibold uppercase tracking-[0.25em] text-ink transition hover:brightness-110"
          >
            Create a character
            <ChevronRight size={16} aria-hidden />
          </button>

          <div className="animate-rise mt-16 w-full">
            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-muted/60">
              Runs other people finished
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {SEED_RUNS.map((run) => (
                <Link key={run.id} href={`/saved?c=${run.id}`} className="group text-left">
                  <AvatarPreview traits={run.state.initialTraits} badges={false} />
                  <p className="mt-2 font-display text-sm text-parchment group-hover:text-gold-soft">
                    {run.state.finalCard?.name}
                  </p>
                  <p className="text-[11px] italic text-muted/70">
                    {run.state.finalCard?.archetypeTitle}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </main>
      )}

      {view === "create" && <CharacterCreator onWeave={begin} />}

      {view === "intro" && game && (
        <main className="mx-auto flex min-h-[calc(100dvh-64px)] max-w-xl flex-col justify-center px-6 py-16">
          <p className="animate-rise font-mono text-xs uppercase tracking-[0.4em] text-gold-soft/70">
            The story
          </p>
          <h1 className="animate-rise mt-3 font-display text-5xl text-parchment">
            {INTRO.title}
          </h1>
          <p className="animate-rise mt-5 whitespace-pre-line text-[15px] leading-relaxed text-muted">
            {INTRO.body}
          </p>
          <button
            type="button"
            onClick={() => setView("play")}
            className="animate-rise mt-8 inline-flex w-fit items-center gap-2 rounded-full border border-gold/50 bg-gold/15 px-7 py-3.5 text-sm font-medium uppercase tracking-[0.2em] text-gold-soft transition hover:bg-gold/25"
          >
            Begin
            <ChevronRight size={16} aria-hidden />
          </button>
        </main>
      )}

      {(view === "play" || view === "calculating") && game && (
        <StoryStage
          state={game}
          outcome={outcome}
          busy={view === "calculating"}
          onChoose={choose}
          onContinue={continueStory}
        />
      )}

      {view === "reveal" && game && (
        <FinalReveal
          state={game}
          saved={saved}
          onSave={handleSave}
          onReplayCharacter={replayCharacter}
          onNewCharacter={newCharacter}
        />
      )}
    </>
  );
}
