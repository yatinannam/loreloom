import { useCallback, useMemo, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import SiteHeader from "@/components/SiteHeader";
import CharacterCard from "@/components/CharacterCard";
import CharacterReveal from "@/components/CharacterReveal";
import { useToast } from "@/components/Toast";
import { SEED_CHARACTERS } from "@/lib/seeds";
import { deleteCharacter } from "@/lib/storage";
import { useSavedCharacters } from "@/lib/useSaved";

export default function SavedPage() {
  const router = useRouter();
  const toast = useToast();
  const mine = useSavedCharacters();
  // undefined = follow the ?c= URL param, null = explicitly closed, string = opened
  const [override, setOverride] = useState<string | null | undefined>(undefined);

  const queryC = typeof router.query.c === "string" ? router.query.c : null;
  const openId = override === undefined ? queryC : override;

  const all = useMemo(() => [...mine, ...SEED_CHARACTERS], [mine]);
  const open = useMemo(
    () => all.find((c) => c.id === openId) ?? null,
    [all, openId],
  );

  const handleDelete = useCallback(
    (id: string) => {
      deleteCharacter(id);
      setOverride((cur) => (cur === id ? null : cur));
      toast("Removed from your collection");
    },
    [toast],
  );

  if (open) {
    return (
      <>
        <Head>
          <title>{open.character.name} — Loreloom</title>
        </Head>
        <SiteHeader savedCount={mine.length} active="saved" />
        <CharacterReveal
          traits={open.traits}
          character={open.character}
          saved
          onSave={() => {}}
          onWeaveAnother={() => setOverride(null)}
        />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Your collection — Loreloom</title>
      </Head>
      <SiteHeader savedCount={mine.length} active="saved" />

      <main className="mx-auto max-w-5xl px-5 pb-24 pt-6">
        <h1 className="font-display text-3xl text-parchment">Your collection</h1>
        <p className="mt-1 text-sm text-muted">
          Characters you&rsquo;ve woven, kept on this device.
        </p>

        {mine.length === 0 && (
          <div className="mt-8 rounded-3xl border border-dashed border-white/15 bg-white/[0.02] p-10 text-center">
            <p className="font-display text-lg text-parchment">
              Nothing woven yet
            </p>
            <p className="mx-auto mt-2 max-w-xs text-sm text-muted">
              Your saved characters will gather here. Start with a few traits and
              see who turns up.
            </p>
            <Link
              href="/"
              className="mt-5 inline-block rounded-full bg-gradient-to-r from-gold to-ember px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-ink"
            >
              Weave a character
            </Link>
          </div>
        )}

        {mine.length > 0 && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mine.map((c) => (
              <CharacterCard
                key={c.id}
                traits={c.traits}
                character={c.character}
                onClick={() => setOverride(c.id)}
                onDelete={() => handleDelete(c.id)}
              />
            ))}
          </div>
        )}

        <h2 className="mt-14 font-display text-2xl text-parchment">
          Woven by Loreloom
        </h2>
        <p className="mt-1 text-sm text-muted">
          Examples to show the range — these don&rsquo;t use any API calls.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SEED_CHARACTERS.map((c) => (
            <CharacterCard
              key={c.id}
              traits={c.traits}
              character={c.character}
              onClick={() => setOverride(c.id)}
            />
          ))}
        </div>
      </main>
    </>
  );
}
