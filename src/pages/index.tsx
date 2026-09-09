import { useCallback, useRef, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import CharacterCreator from "@/components/CharacterCreator";
import GenerationOverlay from "@/components/GenerationOverlay";
import CharacterReveal from "@/components/CharacterReveal";
import AvatarPreview from "@/components/AvatarPreview";
import { useToast } from "@/components/Toast";
import { SEED_CHARACTERS } from "@/lib/seeds";
import { saveCharacter, isSaved } from "@/lib/storage";
import { useSavedCharacters } from "@/lib/useSaved";
import type { CharacterTraits, GeneratedCharacter } from "@/lib/types";

type View = "landing" | "create" | "generating" | "reveal";

export default function Home() {
  const [view, setView] = useState<View>("landing");
  const [traits, setTraits] = useState<CharacterTraits | null>(null);
  const [character, setCharacter] = useState<GeneratedCharacter | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const inFlight = useRef(false);
  const toast = useToast();
  const savedCount = useSavedCharacters().length;

  const generate = useCallback(async (t: CharacterTraits) => {
    if (inFlight.current) return;
    inFlight.current = true;
    setTraits(t);
    setError(null);
    setView("generating");
    const startedAt = Date.now();
    try {
      const res = await fetch("/api/generate-character", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(t),
      });
      const data = (await res.json()) as
        | { character: GeneratedCharacter }
        | { error: string };
      if (!res.ok || !("character" in data)) {
        throw new Error("error" in data ? data.error : "Something went sideways in the loom.");
      }
      // let the cinematic state breathe for at least a beat
      const elapsed = Date.now() - startedAt;
      if (elapsed < 1600) await new Promise((r) => setTimeout(r, 1600 - elapsed));
      setCharacter(data.character);
      setSaved(isSaved(data.character));
      setView("reveal");
      if (typeof window !== "undefined") window.scrollTo({ top: 0 });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went sideways in the loom. Try weaving again.");
      setView("create");
    } finally {
      inFlight.current = false;
    }
  }, []);

  const handleSave = useCallback(() => {
    if (!traits || !character || saved) return;
    saveCharacter(traits, character);
    setSaved(true);
    toast("Woven into your collection");
  }, [traits, character, saved, toast]);

  const weaveAnother = useCallback(() => {
    setCharacter(null);
    setError(null);
    setView("create");
  }, []);

  return (
    <>
      <Head>
        <title>Loreloom — Weave a character, discover their story</title>
      </Head>

      {view === "generating" && traits && <GenerationOverlay traits={traits} />}

      {view !== "reveal" && (
        <SiteHeader savedCount={savedCount} active="create" />
      )}

      {view === "landing" && (
        <main className="mx-auto flex min-h-[calc(100dvh-64px)] max-w-3xl flex-col items-center justify-center px-6 py-16 text-center">
          <p className="animate-rise font-mono text-xs uppercase tracking-[0.5em] text-gold-soft/70">
            An AI character designer
          </p>
          <h1 className="animate-rise mt-5 font-display text-6xl leading-[0.95] text-parchment sm:text-8xl">
            LORELOOM
          </h1>
          <p className="animate-rise mt-6 font-display text-xl italic text-gold-soft sm:text-2xl">
            Weave a character.
            <br />
            Discover their story.
          </p>
          <p className="animate-rise mx-auto mt-5 max-w-sm text-[15px] leading-relaxed text-muted text-balance">
            Choose a few traits. Let Claude uncover who they really are.
          </p>
          <button
            type="button"
            onClick={() => setView("create")}
            className="animate-rise mt-9 rounded-full bg-gradient-to-r from-gold to-ember px-9 py-4 text-sm font-semibold uppercase tracking-[0.25em] text-ink transition hover:brightness-110"
          >
            Create a character
          </button>

          <div className="animate-rise mt-16 w-full">
            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-muted/60">
              Woven earlier
            </p>
            <div className="grid grid-cols-3 gap-3">
              {SEED_CHARACTERS.map((s) => (
                <Link
                  key={s.id}
                  href={`/saved?c=${s.id}`}
                  className="group text-left"
                >
                  <AvatarPreview traits={s.traits} badges={false} />
                  <p className="mt-2 font-display text-sm text-parchment group-hover:text-gold-soft">
                    {s.character.name}
                  </p>
                  <p className="text-[11px] italic text-muted/70">
                    {s.character.title}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </main>
      )}

      {(view === "create" || view === "generating") && (
        <CharacterCreator
          onWeave={generate}
          error={error}
          onRetry={traits ? () => generate(traits) : undefined}
        />
      )}

      {view === "reveal" && traits && character && (
        <CharacterReveal
          traits={traits}
          character={character}
          saved={saved}
          onSave={handleSave}
          onWeaveAnother={weaveAnother}
        />
      )}
    </>
  );
}
