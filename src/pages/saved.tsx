import { useCallback, useMemo, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { Sparkles } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import EarnedCard from "@/components/EarnedCard";
import FinalReveal from "@/components/FinalReveal";
import SiteFooter from "@/components/SiteFooter";
import { useToast } from "@/components/Toast";
import { deleteRun } from "@/lib/storage";
import { useSavedRuns } from "@/lib/useSaved";

export default function SavedPage() {
  const router = useRouter();
  const toast = useToast();
  const mine = useSavedRuns();
  // undefined = follow the ?c= URL param, null = explicitly closed, string = opened
  const [override, setOverride] = useState<string | null | undefined>(undefined);

  const queryC = typeof router.query.c === "string" ? router.query.c : null;
  const openId = override === undefined ? queryC : override;

  const open = useMemo(
    () => mine.find((r) => r.id === openId) ?? null,
    [mine, openId],
  );

  const handleDelete = useCallback(
    (id: string) => {
      deleteRun(id);
      setOverride((cur) => (cur === id ? null : cur));
      toast("Removed from your collection");
    },
    [toast],
  );

  if (open) {
    return (
      <>
        <Head>
          <title>Loreloom</title>
        </Head>
        <SiteHeader savedCount={mine.length} active="saved" />
        <FinalReveal
          state={open.state}
          saved
          readOnly
          onSave={() => {}}
          onReplayCharacter={() => router.push("/")}
          onNewCharacter={() => router.push("/")}
        />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Loreloom</title>
      </Head>
      <SiteHeader savedCount={mine.length} active="saved" />

      <main className="mx-auto max-w-5xl px-5 pb-24 pt-6">
        <h1 className="font-display text-3xl text-parchment">Your collection</h1>
        <p className="mt-1 text-sm text-muted">
          Characters you earned, kept on this device.
        </p>

        {mine.length === 0 && (
          <div className="mt-8 rounded-3xl border border-dashed border-white/15 bg-white/[0.02] p-10 text-center">
            <p className="font-display text-lg text-parchment">Nothing earned yet</p>
            <p className="mx-auto mt-2 max-w-xs text-sm text-muted">
              Finish a run and save the card, and it will gather here. Every run
              of the same character can end differently.
            </p>
            <Link
              href="/"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gold to-ember px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-ink"
            >
              <Sparkles size={14} aria-hidden />
              Start a character
            </Link>
          </div>
        )}

        {mine.length > 0 && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mine.map((run) => (
              <EarnedCard
                key={run.id}
                state={run.state}
                onClick={() => setOverride(run.id)}
                onDelete={() => handleDelete(run.id)}
              />
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
