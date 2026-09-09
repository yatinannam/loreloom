import { Trash2 } from "lucide-react";
import AvatarPreview from "./AvatarPreview";
import { cardFamily, type CardFamily } from "@/game/card";
import { mulberry32, subSeed } from "@/game/random";
import type { CharacterGameState, Rarity } from "@/game/types";

/* ------------------------------------------------------------------ families */
/* Every earned card belongs to one of four families, decided by the alignment of
   the ending it reached. The family owns the look: a border colour, a faint
   texture, and how the name is set. A Guardian card and an Opportunist card
   should not be mistakable for each other at a glance. */

interface FamilyLook {
  /** family accent, drives the border colour and the core-stat bars */
  hex: string;
  /** faint texture laid behind the card */
  texture: React.CSSProperties;
  /** how the name is typeset */
  name: string;
  label: string;
}

const FAMILY: Record<CardFamily, FamilyLook> = {
  principled: {
    hex: "#e8b64c",
    texture: {
      backgroundImage:
        "repeating-linear-gradient(0deg, rgba(232,182,76,0.045) 0 1px, transparent 1px 8px)",
    },
    name: "font-display uppercase tracking-[0.12em] text-gold-soft",
    label: "Order",
  },
  pragmatic: {
    hex: "#5fd3c4",
    texture: {
      backgroundImage:
        "linear-gradient(rgba(95,211,196,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(95,211,196,0.055) 1px, transparent 1px)",
      backgroundSize: "24px 24px",
    },
    name: "font-display tracking-tight text-parchment",
    label: "Ledger",
  },
  unbound: {
    hex: "#ff7a4d",
    texture: {
      backgroundImage:
        "radial-gradient(circle at 20% 28%, rgba(255,122,77,0.11), transparent 42%), radial-gradient(circle at 84% 80%, rgba(255,90,60,0.09), transparent 46%)",
    },
    name: "font-display italic text-ember",
    label: "Free hand",
  },
  arcane: {
    hex: "#9a7bff",
    texture: {
      backgroundImage:
        "radial-gradient(circle at 18% 22%, rgba(255,255,255,0.45) 0.6px, transparent 1px), radial-gradient(circle at 64% 48%, rgba(255,255,255,0.32) 0.6px, transparent 1px), radial-gradient(circle at 84% 82%, rgba(255,255,255,0.36) 0.6px, transparent 1px), radial-gradient(circle at 40% 88%, rgba(255,255,255,0.28) 0.5px, transparent 1px)",
    },
    name: "font-display text-parchment [text-shadow:0_0_16px_rgba(154,123,255,0.5)]",
    label: "Unwritten",
  },
};

/* One clean border for every card. It brightens and thickens as the run gets
   rarer, and the reveal's hero card sits a step stronger than a grid tile.
   Colour rides on an inline style so the family hex can drive it directly. */
function frameFor(rarity: Rarity, hero: boolean): { className: string; alpha: number } {
  const strong = rarity === "Epic" || rarity === "Legendary";
  const mid = rarity === "Rare";
  return {
    className: rarity === "Legendary" ? "border-2" : "border",
    alpha: strong || hero ? 0.55 : mid ? 0.45 : 0.3,
  };
}

const RARITY_FINISH: Record<Rarity, string> = {
  Common: "",
  Uncommon: "",
  Rare: "finish-sweep",
  Epic: "finish-sweep",
  Legendary: "finish-pulse",
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
  const hero = variant === "hero";
  const { className: borderWidth, alpha } = frameFor(card.rarity, hero);

  const Tag = onClick ? "button" : "div";

  return (
    <div className={`group relative ${reveal}`}>
      <Tag
        type={onClick ? "button" : undefined}
        onClick={onClick}
        style={
          {
            "--fx": look.hex,
            borderColor: `color-mix(in srgb, ${look.hex} ${alpha * 100}%, transparent)`,
          } as React.CSSProperties
        }
        className={`relative block w-full overflow-hidden rounded-[20px] border-solid bg-ink-2 text-left ${borderWidth} ${RARITY_FINISH[card.rarity]} ${
          onClick
            ? "transition-transform duration-300 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--fx)]"
            : ""
        }`}
      >
        <div className="pointer-events-none absolute inset-0" style={look.texture} />

        <div className={hero ? "p-4" : "p-3"}>
          <div className="overflow-hidden rounded-[14px]">
            <AvatarPreview traits={t} badges={false} />
          </div>

          <div className="mt-3 px-0.5">
            <div className="flex items-baseline justify-between gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted/50">
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
              <p className="mt-2 line-clamp-2 text-[12px] leading-snug text-muted">
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
                        style={{ width: `${s.value}%`, background: look.hex }}
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
