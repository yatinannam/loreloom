import { useMemo } from "react";
import type { CharacterTraits } from "@/lib/types";
import { avatarPalette, avatarShape, hashUnit } from "@/lib/avatar";
import { SPECIES_ICON, ROLE_ICON, VIBE_ICON } from "@/lib/traits";

interface Props {
  traits: CharacterTraits;
  /** show the species / role / vibe badges around the card */
  badges?: boolean;
  className?: string;
}

export default function AvatarPreview({ traits, badges = true, className }: Props) {
  const pal = useMemo(() => avatarPalette(traits), [traits]);
  const shape = useMemo(() => avatarShape(traits), [traits]);
  const seed = `${traits.species}|${traits.role}|${traits.vibe}|${traits.quirk}`;
  const jitter = hashUnit(seed);

  const shoulderW = 62 * shape.shoulders;
  const uid = seed.replace(/[^a-z0-9]/gi, "");

  const SpeciesIcon = SPECIES_ICON[traits.species];
  const RoleIcon = ROLE_ICON[traits.role];
  const VibeIcon = VIBE_ICON[traits.vibe];

  return (
    <div className={`relative ${className ?? ""}`}>
      <svg
        viewBox="0 0 320 400"
        className="w-full h-auto rounded-[26px] border border-white/10"
        role="img"
        aria-label={`${traits.vibe} ${traits.species} ${traits.role} portrait`}
      >
        <defs>
          <linearGradient id={`bg-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={pal.bgFrom} />
            <stop offset="1" stopColor={pal.bgTo} />
          </linearGradient>
          <radialGradient id={`glow-${uid}`} cx="50%" cy="38%" r="55%">
            <stop offset="0" stopColor={pal.glow} stopOpacity="0.55" />
            <stop offset="1" stopColor={pal.glow} stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`fig-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={pal.figure} />
            <stop offset="1" stopColor="#000000" stopOpacity="0.6" />
          </linearGradient>
        </defs>

        <rect width="320" height="400" fill={`url(#bg-${uid})`} />
        <ellipse cx="160" cy="150" rx="150" ry="150" fill={`url(#glow-${uid})`} />

        {/* drifting motes */}
        {Array.from({ length: 7 }).map((_, i) => {
          const r = hashUnit(seed + i);
          return (
            <circle
              key={i}
              cx={30 + r * 260}
              cy={40 + hashUnit(seed + "y" + i) * 320}
              r={0.8 + r * 1.8}
              fill={pal.rim}
              opacity={0.15 + r * 0.35}
            />
          );
        })}

        {/* halo behind head for ghost/fae */}
        {shape.head === 5 && (
          <circle
            cx="160"
            cy="132"
            r="46"
            fill="none"
            stroke={pal.rim}
            strokeOpacity="0.7"
            strokeWidth="2"
          />
        )}

        {/* shoulders / torso */}
        <path
          d={`M ${160 - shoulderW} 400
              C ${160 - shoulderW} ${300 - jitter * 20}, ${160 - 34} 250, 160 250
              C ${160 + 34} 250, ${160 + shoulderW} ${300 - jitter * 20}, ${160 + shoulderW} 400 Z`}
          fill={`url(#fig-${uid})`}
        />
        {/* garment accent */}
        <path
          d={`M ${160 - 10} 250 L 160 330 L ${160 + 10} 250 Z`}
          fill={pal.accent}
          opacity="0.9"
        />
        <path
          d={`M ${160 - shoulderW} 400
              C ${160 - shoulderW} ${300 - jitter * 20}, ${160 - 34} 250, 160 250`}
          fill="none"
          stroke={pal.rim}
          strokeOpacity="0.5"
          strokeWidth="2"
        />

        {/* head */}
        <circle cx="160" cy="150" r="40" fill={`url(#fig-${uid})`} />
        <path
          d="M 122 150 A 40 40 0 0 1 198 150"
          fill="none"
          stroke={pal.rim}
          strokeOpacity="0.75"
          strokeWidth="2.5"
        />

        {/* headwear */}
        {shape.head === 1 && (
          <path
            d="M 116 152 C 118 96, 202 96, 204 152 C 200 120, 120 120, 116 152 Z"
            fill={pal.figure}
            stroke={pal.rim}
            strokeOpacity="0.4"
          />
        )}
        {shape.head === 2 && (
          <path
            d="M 132 118 L 140 96 L 152 114 L 160 92 L 168 114 L 180 96 L 188 118 Z"
            fill={pal.accent}
            stroke={pal.rim}
          />
        )}
        {shape.head === 3 && (
          <>
            <path d="M 130 128 C 112 104, 118 92, 122 90 C 126 104, 134 116, 138 122 Z" fill={pal.accent} />
            <path d="M 190 128 C 208 104, 202 92, 198 90 C 194 104, 186 116, 182 122 Z" fill={pal.accent} />
          </>
        )}
        {shape.head === 4 && (
          <>
            <line x1="146" y1="118" x2="138" y2="86" stroke={pal.rim} strokeWidth="2.5" />
            <line x1="174" y1="118" x2="182" y2="86" stroke={pal.rim} strokeWidth="2.5" />
            <circle cx="138" cy="84" r="4" fill={pal.rim} />
            <circle cx="182" cy="84" r="4" fill={pal.rim} />
          </>
        )}

        {/* eyes — a single glowing band, reads at any size */}
        <rect x="140" y="146" width="40" height="6" rx="3" fill={pal.rim} opacity="0.9" />

        {/* floating orb */}
        {shape.orb && (
          <g className="animate-orb">
            <circle cx={232 + jitter * 10} cy="238" r="12" fill={pal.glow} opacity="0.9" />
            <circle cx={232 + jitter * 10} cy="238" r="20" fill={pal.glow} opacity="0.2" />
          </g>
        )}

        <rect
          x="4"
          y="4"
          width="312"
          height="392"
          rx="24"
          fill="none"
          stroke="rgba(255,255,255,0.12)"
        />
      </svg>

      {badges && (
        <>
          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/40 px-3 py-1 text-xs tracking-wide backdrop-blur">
            <SpeciesIcon size={13} aria-hidden /> {traits.species}
          </span>
          <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/40 px-3 py-1 text-xs tracking-wide backdrop-blur">
            <RoleIcon size={13} aria-hidden /> {traits.role}
          </span>
          <span className="absolute bottom-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-gold/40 bg-black/50 px-3 py-1 text-xs uppercase tracking-[0.2em] text-gold-soft backdrop-blur">
            <VibeIcon size={13} aria-hidden /> {traits.vibe}
          </span>
        </>
      )}
    </div>
  );
}
