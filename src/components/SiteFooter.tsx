const LINKS = [
  { label: "GitHub", href: "https://github.com/yatinannam" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/yatinannam" },
];

export default function SiteFooter() {
  return (
    <footer className="mx-auto mt-16 w-full max-w-5xl border-t border-white/10 px-5 py-8 text-center text-xs text-muted/60">
      <p>
        Built by{" "}
        <a
          href="https://github.com/yatinannam"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted/80 underline-offset-4 transition hover:text-parchment hover:underline"
        >
          Yatin Annam
        </a>
      </p>
      <p className="mt-2 flex items-center justify-center gap-5">
        {LINKS.map((l) => (
          <a
            key={l.label}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            className="underline-offset-4 transition hover:text-parchment hover:underline"
          >
            {l.label}
          </a>
        ))}
      </p>
    </footer>
  );
}
