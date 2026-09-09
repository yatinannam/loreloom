import { Trash2 } from "lucide-react";
import AvatarPreview from "./AvatarPreview";
import { cardFamily, type CardFamily } from "@/game/card";
import { mulberry32, subSeed } from "@/game/random";
import type { CharacterGameState, Rarity } from "@/game/types";

/* ------------------------------------------------------------------ families */
/* Each earned card belongs to one of four families, decided by the alignment of
   the ending it reached. The family owns the frame: its border, its corner
   marks, its background texture, and how the name is set. A Guardian card and an
   Opportunist card should not be mistakable for each other at a glance. */

interface FamilyLook {
  /** frame border + inset rule, drawn with box-shadow so it layers over the art */
  frame: string;
  /** faint texture laid behind the whole card */
  texture: React.CSSProperties;
  /** how the name is typeset */
  name: string;
  /** accent used by the rarity finish and the ornament ink */
  accent: string;
  label: string;
}

const FAMILY: Record<CardFamily, FamilyLook> = {
  principled: {
    frame:
      "shadow-[inset_0_0_0_1px_rgba(232,182,76,0.5),inset_0_0_0_4px_rgba(10,9,18,0.9),inset_0_0_0_5px_rgba(232,182,76,0.28)]",
    texture: {
      backgroundImage:
        "repeating-linear-gradient(0deg, rgba(232,182,76,0.05) 0 1px, transparent 1px 7px)",
    },
    name: "font-display uppercase tracking-[0.14em] text-gold-soft",
    accent: "#e8b64c",
    label: "Order",
  },
  pragmatic: {
    frame: "shadow-[inset_0_0_0_1px_rgba(95,211,196,0.42)]",
    texture: {
      backgroundImage:
        "linear-gradient(rgba(95,211,196,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(95,211,196,0.06) 1px, transparent 1px)",
      backgroundSize: "22px 22px",
    },
    name: "font-display text-parchment tracking-tight",
    accent: "#5fd3c4",
    label: "Ledger",
  },
  unbound: {
    frame:
      "shadow-[inset_0_0_0_1px_rgba(255,122,77,0.4),inset_5px_0_0_-1px_rgba(255,122,77,0.75)]",
    texture: {
      backgroundImage:
        "radial-gradient(circle at 22% 30%, rgba(255,122,77,0.12), transparent 40%), radial-gradient(circle at 82% 78%, rgba(255,90,60,0.1), transparent 45%)",
    },
    name: "font-display italic text-ember -rotate-1 origin-left",
    accent: "#ff7a4d",
    label: "Free hand",
  },
  arcane: {
    frame: "shadow-[inset_0_0_0_1px_rgba(154,123,255,0.4)]",
    texture: {
      backgroundImage:
        "radial-gradient(circle at 18% 22%, rgba(255,255,255,0.5) 0.6px, transparent 1px), radial-gradient(circle at 64% 48%, rgba(255,255,255,0.35) 0.6px, transparent 1px), radial-gradient(circle at 84% 82%, rgba(255,255,255,0.4) 0.6px, transparent 1px), radial-gradient(circle at 40% 88%, rgba(255,255,255,0.3) 0.5px, transparent 1px)",
    },
    name: "font-display text-parchment [text-shadow:0_0_18px_rgba(154,123,255,0.55)]",
    accent: "#9a7bff",
    label: "Unwritten",
  },
};

/** A 32x32 corner glyph, repeated at whichever corners the family uses. */
function cornerGlyph(family: CardFamily, accent: string) {
  const s = { stroke: accent, strokeWidth: 1.4, fill: "none" } as const;
  switch (family) {
    case "principled":
      return (
        <path d="M6 26 V10 A4 4 0 0 1 10 6 H26" {...s} />
      );
    case "pragmatic":
      return (
        <g {...s} opacity={0.75}>
          <line x1="6" y1="16" x2="26" y2="16" />
          <line x1="16" y1="6" x2="16" y2="26" />
        </g>
      );
    case "unbound":
      return (
        <g fill={accent} stroke="none" opacity={0.85}>
          <circle cx="10" cy="10" r="1.8" />
          <circle cx="18" cy="7" r="1" />
          <circle cx="7" cy="19" r="1.2" />
        </g>
      );
    default:
      return (
        <g {...s} opacity={0.8}>
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="6" />
          <line x1="12" y1="18" x2="12" y2="23" />
        </g>
      );
  }
}

function Ornament({ family, accent }: { family: CardFamily; accent: string }) {
  // principled: two opposite corners; the others: all four
  const corners =
    family === "principled"
      ? ["top-0 left-0", "bottom-0 right-0 rotate-180"]
      : [
          "top-0 left-0",
          "top-0 right-0 rotate-90",
          "bottom-0 right-0 rotate-180",
          "bottom-0 left-0 -rotate-90",
        ];
  return (
    <>
      {corners.map((pos) => (
        <svg
          key={pos}
          viewBox="0 0 32 32"
          className={`pointer-events-none absolute h-8 w-8 ${pos}`}
          aria-hidden
        >
          {cornerGlyph(family, accent)}
        </svg>
      ))}
    </>
  );
}

const RARITY_FINISH: Record<Rarity, string> = {
  Common: "",
  Uncommon: "",
  Rare: "finish-sweep",
  Epic: "finish-pulse",
  Legendary: "finish-foil",
};

const RARITY_TAG: Record<Rarity, string> = {
  Common: "text-muted/70",
  Uncommon: "text-teal",
  Rare: "text-arcane",
  Epic: "text-gold-soft",
  Legendary: "text-ember",
};

const REVEALS = ["reveal-ink", "reveal-ember", "reveal-frost", "reveal-arcane"];

/* ------------------------------------------------------------------- props */

interface Props {
  state: CharacterGameState;
  variant?: "hero" | "tile";
  onClick?: () => void;
  onDelete?: () => void;
}

export default function EarnedCard({
  state,
  variant = "tile",
  onClick,
  onDelete,
}: Props) {
  const card = state.finalCard;
  if (!card) return null;

  const t = state.initialTraits;
  const family = cardFamily(card.alignment);
  const look = FAMILY[family];
  const reveal = REVEALS[Math.floor(mulberry32(subSeed(state.seed, 0x2222))() * 4)];
  const finish = RARITY_FINISH[card.rarity];
  const hero = variant === "hero";

  const Tag = onClick ? "button" : "div";

  return (
    <div className={`group relative ${reveal}`}>
      <Tag
        type={onClick ? "button" : undefined}
        onClick={onClick}
        style={{ "--fx": look.accent } as React.CSSProperties}
        className={`relative block w-full overflow-hidden rounded-[20px] bg-ink-2 text-left ${look.frame} ${finish} ${
          onClick
            ? "transition-transform duration-300 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--fx)]"
            : ""
        }`}
      >
        <div className="pointer-events-none absolute inset-0" style={look.texture} />
        <Ornament family={family} accent={look.accent} />

        <div className={hero ? "p-4" : "p-3"}>
          <div className="overflow-hidden rounded-[14px]">
            <AvatarPreview traits={t} badges={false} />
          </div>

          <div className="mt-3 px-0.5">
            <div className="flex items-baseline justify-between gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted/50">
                {look.label}
              </span>
              <span
                className={`font-mono text-[10px] uppercase tracking-[0.2em] ${RARITY_TAG[card.rarity]}`}
              >
                {card.rarity}
              </span>
            </div>

            <h3
              className={`mt-1 leading-tight ${look.name} ${hero ? "text-2xl" : "text-lg"}`}
            >
              {card.name}
            </h3>
            <p className="mt-0.5 text-[13px] italic text-muted">
              {card.archetypeTitle}
            </p>

            {hero ? (
              <p className="mt-3 text-[13px] leading-relaxed text-parchment/80">
                {card.openingLine}{" "}
                <span className="text-parchment">{card.becameLine}</span>
              </p>
            ) : (
              <p className="mt-2 text-[12px] leading-snug text-muted line-clamp-2">
                {card.openingLine}
              </p>
            )}

            <div className="mt-3 flex flex-wrap gap-1.5 text-[10px] text-muted/70">
              {[t.species, t.role, card.endingTitle].map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-white/10 px-2 py-0.5"
                >
                  {chip}
                </span>
              ))}
            </div>

            {hero && (
              <dl className="mt-4 space-y-1.5">
                {card.coreStats.map((s) => (
                  <div key={s.key} className="flex items-center gap-3">
                    <dt className="w-20 shrink-0 text-[11px] text-muted">
                      {s.label}
                    </dt>
                    <dd className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
                      <span
                        className="block h-full rounded-full"
                        style={{
                          width: `${s.value}%`,
                          background: look.accent,
                        }}
                      />
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </div>
      </Tag>

      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          aria-label={`Remove ${card.name} from your collection`}
          className="absolute right-2.5 top-2.5 rounded-full border border-white/15 bg-ink/80 p-1.5 text-muted opacity-0 backdrop-blur transition hover:border-ember/50 hover:text-ember focus-visible:opacity-100 group-hover:opacity-100"
        >
          <Trash2 size={12} aria-hidden />
        </button>
      )}
    </div>
  );
}
