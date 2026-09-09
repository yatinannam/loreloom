import Link from "next/link";

interface Props {
  savedCount?: number;
  active?: "create" | "saved";
}

export default function SiteHeader({ savedCount, active }: Props) {
  return (
    <header className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
      <Link
        href="/"
        className="font-display text-xl uppercase tracking-[0.3em] text-parchment transition hover:text-gold-soft sm:text-2xl sm:tracking-[0.34em]"
      >
        Loreloom
      </Link>
      <nav className="flex items-center gap-1 text-xs uppercase tracking-widest">
        <Link
          href="/"
          className={`rounded-full px-3 py-1.5 transition ${
            active === "create" ? "bg-white/10 text-parchment" : "text-muted hover:text-parchment"
          }`}
        >
          Create
        </Link>
        <Link
          href="/saved"
          className={`rounded-full px-3 py-1.5 transition ${
            active === "saved" ? "bg-white/10 text-parchment" : "text-muted hover:text-parchment"
          }`}
        >
          Collection{typeof savedCount === "number" && savedCount > 0 ? ` · ${savedCount}` : ""}
        </Link>
      </nav>
    </header>
  );
}
