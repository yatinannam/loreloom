import AvatarPreview from "./AvatarPreview";
import type { CharacterTraits, GeneratedCharacter } from "@/lib/types";

interface Props {
  traits: CharacterTraits;
  character: GeneratedCharacter;
  onClick?: () => void;
  onDelete?: () => void;
}

export default function CharacterCard({ traits, character, onClick, onDelete }: Props) {
  const Wrapper = onClick ? "button" : "div";
  return (
    <div className="group relative">
      <Wrapper
        type={onClick ? "button" : undefined}
        onClick={onClick}
        className={`glass block w-full overflow-hidden rounded-3xl p-3 text-left transition-transform duration-200 ${
          onClick ? "hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold" : ""
        }`}
      >
        <AvatarPreview traits={traits} badges={false} className="mb-3" />
        <div className="px-1 pb-1">
          <h3 className="font-display text-lg leading-tight text-parchment">
            {character.name}
          </h3>
          <p className="text-xs italic text-gold-soft/80">{character.title}</p>
          <p className="mt-1.5 text-[13px] leading-snug text-muted">
            &ldquo;{character.oneLiner}&rdquo;
          </p>
          <div className="mt-2 flex flex-wrap gap-1 text-[10px] uppercase tracking-wider text-muted/70">
            <span className="rounded-full border border-white/10 px-2 py-0.5">{traits.species}</span>
            <span className="rounded-full border border-white/10 px-2 py-0.5">{traits.role}</span>
            <span className="rounded-full border border-white/10 px-2 py-0.5">{traits.vibe}</span>
          </div>
        </div>
      </Wrapper>
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          aria-label={`Delete ${character.name}`}
          className="absolute right-3 top-3 rounded-full border border-white/15 bg-ink/70 px-2 py-1 text-xs text-muted opacity-0 backdrop-blur transition hover:border-ember/50 hover:text-ember group-hover:opacity-100 focus-visible:opacity-100"
        >
          Delete
        </button>
      )}
    </div>
  );
}
