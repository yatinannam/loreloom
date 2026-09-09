import { Trash2 } from "lucide-react";
import AvatarPreview from "./AvatarPreview";
import type { CharacterGameState, Rarity } from "@/game/types";

const RARITY_STYLE: Record<Rarity, string> = {
  Common: "border-white/15 text-muted",
  Uncommon: "border-teal/40 text-teal",
  Rare: "border-arcane/50 text-arcane",
  Epic: "border-gold/50 text-gold-soft",
  Legendary: "border-ember/60 text-ember",
};

interface Props {
  state: CharacterGameState;
  onClick?: () => void;
  onDelete?: () => void;
}

export default function CharacterCard({ state, onClick, onDelete }: Props) {
  const card = state.finalCard;
  const t = state.initialTraits;
  if (!card) return null;

  const Wrapper = onClick ? "button" : "div";

  return (
    <div className="group relative">
      <Wrapper
        type={onClick ? "button" : undefined}
        onClick={onClick}
        className={`glass block w-full overflow-hidden rounded-3xl p-3 text-left transition-transform duration-200 ${
          onClick
            ? "hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
            : ""
        }`}
      >
        <div
          className="mb-3 overflow-hidden rounded-[22px]"
          style={{
            boxShadow: `inset 0 0 0 1px ${card.palette.accent}55, 0 0 22px -6px ${card.palette.accent}55`,
          }}
        >
          <AvatarPreview traits={t} badges={false} />
        </div>
        <div className="px-1 pb-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-display text-lg leading-tight text-parchment">
              {card.name}
            </h3>
            <span
              className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wider ${RARITY_STYLE[card.rarity]}`}
            >
              {card.rarity}
            </span>
          </div>
          <p className="text-xs italic text-gold-soft/80">{card.archetypeTitle}</p>
          <p className="mt-1.5 text-[13px] leading-snug text-muted">
            {card.openingLine}
          </p>
          <div className="mt-2 flex flex-wrap gap-1 text-[10px] uppercase tracking-wider text-muted/70">
            <span className="rounded-full border border-white/10 px-2 py-0.5">{t.species}</span>
            <span className="rounded-full border border-white/10 px-2 py-0.5">{t.role}</span>
            <span className="rounded-full border border-white/10 px-2 py-0.5">
              {card.endingTitle}
            </span>
          </div>
        </div>
      </Wrapper>
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          aria-label={`Delete ${card.name}`}
          className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full border border-white/15 bg-ink/70 px-2 py-1 text-xs text-muted opacity-0 backdrop-blur transition hover:border-ember/50 hover:text-ember group-hover:opacity-100 focus-visible:opacity-100"
        >
          <Trash2 size={12} aria-hidden />
        </button>
      )}
    </div>
  );
}
