import { useMemo } from "react";
import type { CharacterTraits } from "@/lib/types";
import { avatarSpec, hashUnit, type AvatarSpec } from "@/lib/avatar";

interface Props {
  traits: CharacterTraits;
  /** show the species / role / vibe badges around the card */
  badges?: boolean;
  className?: string;
}

const HEAD_CX = 160;
const HEAD_CY = 150;

/** round to 2dp so SSR and client serialise identical coordinate strings */
const r2 = (n: number) => Math.round(n * 100) / 100;
const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

/* ------------------------------------------------------------------ pieces */

function headPath(shape: AvatarSpec["head"]) {
  switch (shape) {
    case "oval":
      return <ellipse cx={HEAD_CX} cy={HEAD_CY} rx={36} ry={47} />;
    case "wide":
      return <ellipse cx={HEAD_CX} cy={HEAD_CY} rx={50} ry={40} />;
    case "domed":
      return (
        <path d="M160 104 C 200 104 210 134 202 158 C 196 178 178 196 160 196 C 142 196 124 178 118 158 C 110 134 120 104 160 104 Z" />
      );
    case "angular":
      return (
        <path d="M160 106 C 181 106 196 117 198 137 L 193 174 C 191 188 177 196 160 196 C 143 196 129 188 127 174 L 122 137 C 124 117 139 106 160 106 Z" />
      );
    default:
      return <circle cx={HEAD_CX} cy={HEAD_CY} r={43} />;
  }
}

function Hair({ spec }: { spec: AvatarSpec }) {
  const { hair, palette } = spec;
  if (hair === "none") return null;

  if (hair === "wisp") {
    return (
      <g stroke={palette.hair} strokeWidth={3} strokeLinecap="round" fill="none" opacity={0.7}>
        <path d="M140 116 C 136 100 146 92 142 78" />
        <path d="M160 112 C 158 96 166 88 160 72" />
        <path d="M180 116 C 184 100 174 92 178 78" />
      </g>
    );
  }

  if (hair === "peak") {
    // slicked-back crown with a widow's-peak point onto the brow
    return (
      <g fill={palette.hair}>
        <path d="M120 132 C 122 100 198 100 200 132 C 190 120 174 116 160 122 C 146 116 130 120 120 132 Z" />
        <path d="M153 120 L160 138 L167 120 Z" />
      </g>
    );
  }

  if (hair === "long") {
    return (
      <>
        <path
          d="M116 210 C 108 150 112 108 160 100 C 208 108 212 150 204 210 L 190 244 C 196 190 200 150 190 126 C 176 108 144 108 130 126 C 120 150 124 190 130 244 Z"
          fill={palette.hair}
          opacity={0.95}
        />
        <path
          d="M120 128 C 128 100 192 100 200 128 C 190 116 176 110 160 118 C 144 110 130 116 120 128 Z"
          fill={palette.hair}
        />
      </>
    );
  }

  // short — covers the crown and frames down past the ears with a soft fringe
  return (
    <path
      d="M116 158 C 108 150 110 106 160 100 C 210 106 212 150 204 158 C 202 138 196 122 186 120 C 180 130 172 132 160 122 C 148 132 140 130 134 120 C 124 122 118 138 116 158 Z"
      fill={palette.hair}
    />
  );
}

function Ears({ spec }: { spec: AvatarSpec }) {
  const { ears, palette } = spec;
  if (ears === "none") return null;
  const y = HEAD_CY + 2;
  if (ears === "long") {
    return (
      <g fill={palette.skin} stroke={palette.skinShade} strokeWidth={1}>
        <path d={`M126 ${y} C 108 ${y - 26} 104 ${y - 34} 118 ${y - 14} C 122 ${y - 4} 126 ${y + 2} 126 ${y}`} />
        <path d={`M194 ${y} C 212 ${y - 26} 216 ${y - 34} 202 ${y - 14} C 198 ${y - 4} 194 ${y + 2} 194 ${y}`} />
      </g>
    );
  }
  return (
    <g fill={palette.skin} stroke={palette.skinShade} strokeWidth={1}>
      <ellipse cx={124} cy={y} rx={6} ry={9} />
      <ellipse cx={196} cy={y} rx={6} ry={9} />
    </g>
  );
}

function Horns({ spec }: { spec: AvatarSpec }) {
  const { horns, palette } = spec;
  if (horns === "none") return null;
  const fill = palette.rim;
  if (horns === "curved") {
    return (
      <g fill={fill} stroke="#00000055" strokeWidth={1}>
        <path d="M132 122 C 108 108 104 82 116 74 C 112 92 120 108 140 118 Z" />
        <path d="M188 122 C 212 108 216 82 204 74 C 208 92 200 108 180 118 Z" />
      </g>
    );
  }
  // straight, swept back
  return (
    <g fill={fill} stroke="#00000055" strokeWidth={1}>
      <path d="M134 118 L120 78 L128 76 L146 112 Z" />
      <path d="M186 118 L200 78 L192 76 L174 112 Z" />
    </g>
  );
}

function Face({ spec, flicker }: { spec: AvatarSpec; flicker: number }) {
  const { palette, expr, chaos, bigEyes, split, fang, faceCover, snout } = spec;
  const showLower = faceCover === "none" && !snout;
  // brows stay off for a calm face; they only appear with real intensity
  const browShown = showLower && (expr > 0.6 || chaos > 0.78);
  // near-level by default, tips slightly down only when chaotic
  const browTilt = r2(chaos * 4 - expr * 1.5 - 1.2);
  // roughly flat at neutral; curls up with expression, flattens/downs with chaos
  const mouthCurve = clamp(r2((expr - 0.5) * 12 - chaos * 3 + 0.4), -3, 5);

  return (
    <g>
      {/* eyes */}
      {bigEyes ? (
        <g fill="#0a0a10">
          <path d="M134 148 Q 140 140 152 144 Q 156 152 150 159 Q 138 160 134 152 Z" />
          <path d="M186 148 Q 180 140 168 144 Q 164 152 170 159 Q 182 160 186 152 Z" />
          <circle cx={147} cy={146} r={1.5} fill={palette.rim} opacity={0.45} />
          <circle cx={173} cy={146} r={1.5} fill={palette.rim} opacity={0.45} />
        </g>
      ) : split ? (
        <>
          <ellipse cx={148} cy={150} rx={6} ry={4} fill={palette.rim} />
          <circle cx={174} cy={150} r={6} fill="#0b0b12" stroke={palette.accent} strokeWidth={2} />
          <circle cx={174} cy={150} r={2.4} fill={palette.accent} opacity={r2(0.6 + flicker * 0.4)} />
        </>
      ) : (
        <g fill="#0b0b12">
          <ellipse cx={148} cy={150} rx={4.4} ry={3.6} />
          <ellipse cx={172} cy={150} rx={4.4} ry={3.6} />
          <circle cx={149.4} cy={148.8} r={1} fill={palette.rim} opacity={0.35} />
          <circle cx={173.4} cy={148.8} r={1} fill={palette.rim} opacity={0.35} />
        </g>
      )}

      {browShown && (
        <g stroke={palette.hair} strokeWidth={1.8} strokeLinecap="round" opacity={0.85}>
          <line x1={141} y1={137} x2={155} y2={r2(137 + browTilt)} />
          <line x1={179} y1={137} x2={165} y2={r2(137 + browTilt)} />
        </g>
      )}

      {/* nose — a soft shadow along one side */}
      <path
        d="M160 152 C 158 160 156 166 161 169 C 163 169 164 168 165 167"
        fill="none"
        stroke={palette.skinShade}
        strokeWidth={1.6}
        strokeLinecap="round"
        opacity={0.7}
      />

      {showLower && (
        <path
          d={`M151 175 Q 160 ${r2(175 + mouthCurve)} 169 175`}
          fill="none"
          stroke={palette.skinShade}
          strokeWidth={2}
          strokeLinecap="round"
        />
      )}

      {fang && showLower && <path d="M156 176 L159 183 L162 176 Z" fill="#f4ecdd" />}
    </g>
  );
}

function FaceCover({ spec }: { spec: AvatarSpec }) {
  if (spec.faceCover === "none") return null;
  const { palette } = spec;
  // both cover the face from just under the eyes to the chin, with a clear top hem
  const y = 154;
  if (spec.faceCover === "mask") {
    return (
      <g>
        <path
          d={`M132 ${y} Q 160 ${y + 4} 188 ${y} L 184 190 Q 160 198 136 190 Z`}
          fill="#33303a"
        />
        <path d={`M132 ${y} Q 160 ${y + 4} 188 ${y}`} fill="none" stroke="#5a5666" strokeWidth={1.5} />
        <line x1={160} y1={y + 2} x2={160} y2={192} stroke="#00000030" strokeWidth={1.5} />
      </g>
    );
  }
  // loose scarf pulled up over nose and mouth, knotted to one side
  return (
    <g>
      <path
        d={`M130 ${y} Q 160 ${y + 6} 190 ${y} L 185 190 Q 160 200 135 190 Z`}
        fill={palette.accent}
      />
      <path d={`M130 ${y} Q 160 ${y + 6} 190 ${y}`} fill="none" stroke="#ffffff40" strokeWidth={1.5} />
      <path d="M188 160 L206 168 L196 178 Z" fill={palette.accent} opacity={0.85} />
    </g>
  );
}

function Headgear({ spec }: { spec: AvatarSpec }) {
  const { headgear, palette } = spec;
  switch (headgear) {
    case "witchHat":
      return (
        <g>
          <path d="M96 118 C 130 112 190 112 224 118 C 210 126 110 126 96 118 Z" fill={palette.garment} />
          <path d="M160 24 C 176 60 196 100 210 118 C 180 112 140 112 110 118 C 124 100 144 60 160 24 Z" fill={palette.garment} stroke={palette.accent} strokeWidth={1.5} />
          <path d="M150 66 C 158 70 166 70 172 66 L 170 82 C 162 86 156 86 150 82 Z" fill={palette.accent} />
        </g>
      );
    case "hood":
      return null; // drawn behind the head, see Hood
    case "crown":
      return (
        <path
          d="M128 112 L136 90 L150 108 L160 84 L170 108 L184 90 L192 112 Z"
          fill={palette.accent}
          stroke="#00000044"
        />
      );
    case "circlet":
      return <path d="M126 118 C 145 128 175 128 194 118" fill="none" stroke={palette.accent} strokeWidth={3} />;
    case "goggles":
      return (
        <g transform="rotate(-7 160 122)">
          <path d="M124 122 C 145 112 175 112 196 122" fill="none" stroke={palette.metal} strokeWidth={4} />
          <circle cx={142} cy={122} r={11} fill="#0c1418" stroke={palette.metal} strokeWidth={3.5} />
          <circle cx={178} cy={122} r={11} fill="#0c1418" stroke={palette.metal} strokeWidth={3.5} />
          <circle cx={142} cy={122} r={5} fill={palette.accent} opacity={0.7} />
          <circle cx={178} cy={122} r={5} fill={palette.accent} opacity={0.7} />
          <line x1={153} y1={122} x2={167} y2={122} stroke={palette.metal} strokeWidth={3} />
        </g>
      );
    case "bandana":
      return (
        <g fill={palette.accent}>
          <path d="M120 126 C 145 116 175 116 200 126 L 198 134 C 174 126 146 126 122 134 Z" />
          <path d="M198 128 L214 124 L206 140 Z" />
        </g>
      );
    default:
      return null;
  }
}

function Hood({ spec }: { spec: AvatarSpec }) {
  if (spec.headgear !== "hood") return null;
  const { palette } = spec;
  return (
    <>
      {/* cowl draped on the shoulders, behind the head */}
      <path
        d="M96 250 C 70 176 84 92 160 86 C 236 92 250 176 224 250 C 214 214 200 150 160 150 C 120 150 106 214 96 250 Z"
        fill={palette.garment}
      />
      {/* opening rim around the face */}
      <path
        d="M120 190 C 114 132 130 112 160 112 C 190 112 206 132 200 190"
        fill="none"
        stroke={palette.rim}
        strokeOpacity={0.22}
        strokeWidth={2}
      />
    </>
  );
}

function Body({ spec, uid }: { spec: AvatarSpec; uid: string }) {
  const { ghostTail, broad, translucent, posture } = spec;
  const w = broad ? 96 : 86;
  const top = broad ? 70 : 62;
  const slouch = Math.max(0, -posture); // 0..1
  // shoulder line: a touch higher and flatter when confident, lower & rounder when not
  const sy = r2(240 - posture * 3 + slouch * 6);
  const peak = r2(sy - 7);

  if (ghostTail) {
    return (
      <path
        d={`M160 188 C ${160 - 44} 214 ${160 - 30} 320 ${160 - 14} 374 C ${160 - 6} 390 ${160 + 6} 390 ${160 + 14} 374 C ${160 + 30} 320 ${160 + 44} 214 160 188 Z`}
        fill={`url(#fig-${uid})`}
        opacity={0.45}
      />
    );
  }

  return (
    <path
      d={`M ${160 - w} 400
          C ${160 - w} ${r2(sy + 22)}, ${160 - top - 8} ${r2(peak + 6)}, ${160 - top} ${peak}
          Q 160 ${r2(peak - 6 - slouch * 3)} ${160 + top} ${peak}
          C ${160 + top + 8} ${r2(peak + 6)}, ${160 + w} ${r2(sy + 22)}, ${160 + w} 400 Z`}
      fill={`url(#fig-${uid})`}
      opacity={translucent ? 0.5 : 1}
    />
  );
}

function Collar({ spec }: { spec: AvatarSpec }) {
  const { collar, palette } = spec;
  if (collar === "none" || spec.ghostTail) return null;
  if (collar === "cape") {
    return (
      <path
        d="M138 236 C 120 236 108 214 112 196 L 130 214 C 134 226 146 234 160 234 C 174 234 186 226 190 214 L 208 196 C 212 214 200 236 182 236 Z"
        fill={palette.garment}
        stroke={palette.accent}
        strokeWidth={1}
      />
    );
  }
  if (collar === "jagged") {
    return (
      <path
        d="M132 240 L142 214 L152 236 L160 210 L168 236 L178 214 L188 240 Z"
        fill={palette.garment}
        stroke={palette.rim}
        strokeOpacity={0.5}
      />
    );
  }
  if (collar === "coat") {
    return (
      <g fill={palette.garment} stroke={palette.accent} strokeWidth={1}>
        <path d="M150 232 L134 250 L146 286 L160 244 Z" />
        <path d="M170 232 L186 250 L174 286 L160 244 Z" />
      </g>
    );
  }
  // plain
  return <path d="M148 234 L160 252 L172 234 Z" fill={palette.garment} />;
}

function Prop({ spec, flicker }: { spec: AvatarSpec; flicker: number }) {
  const { prop, palette } = spec;
  if (prop === "staff") {
    return (
      <g>
        <line x1={250} y1={110} x2={238} y2={392} stroke="#5b4632" strokeWidth={6} strokeLinecap="round" />
        <circle cx={252} cy={104} r={11} fill={palette.accent} opacity={0.9} />
        <circle cx={252} cy={104} r={20} fill={palette.accent} opacity={0.18 + flicker * 0.12} />
      </g>
    );
  }
  if (prop === "sword") {
    // worn across the body, hilt up by the right shoulder
    return (
      <g stroke="#00000033">
        <path d="M198 150 L210 160 L126 350 L112 342 Z" fill={palette.metal} />
        <path d="M118 346 L112 342 L120 340 Z" fill={palette.metal} />
        <path d="M188 150 L220 136 L226 149 L196 164 Z" fill="#6b5233" stroke="none" />
        <circle cx={210} cy={130} r={5.5} fill={palette.accent} stroke="none" />
      </g>
    );
  }
  if (prop === "book") {
    return (
      <g>
        <path d="M120 300 L160 288 L200 300 L200 340 L160 328 L120 340 Z" fill={palette.garment} stroke={palette.accent} strokeWidth={1.5} />
        <line x1={160} y1={288} x2={160} y2={328} stroke={palette.accent} strokeWidth={1.5} />
      </g>
    );
  }
  if (prop === "wrench") {
    return (
      <path
        d="M232 300 L250 282 A 12 12 0 0 0 232 264 L 244 276 L 236 284 L 224 272 A 12 12 0 0 0 242 290 Z"
        fill={palette.metal}
        transform="rotate(20 238 285)"
      />
    );
  }
  return null;
}

function Extras({ spec, flicker }: { spec: AvatarSpec; flicker: number }) {
  const palette = spec.palette;
  return (
    <>
      {spec.wings && (
        <g opacity={0.42} fill={palette.rim}>
          <path d="M156 206 C 96 150 58 196 74 268 C 108 244 138 224 156 214 Z" />
          <path d="M164 206 C 224 150 262 196 246 268 C 212 244 182 224 164 214 Z" />
          <path d="M156 214 C 112 188 86 214 96 262 C 122 244 144 230 156 222 Z" opacity={0.6} />
          <path d="M164 214 C 208 188 234 214 224 262 C 198 244 176 230 164 222 Z" opacity={0.6} />
        </g>
      )}
      {spec.pauldron && (
        <path d="M112 268 C 110 240 152 238 154 262 C 140 254 124 256 112 268 Z" fill={palette.accent} stroke="#00000044" />
      )}
      {spec.strap && (
        <path d="M132 250 L196 356 L184 366 L120 262 Z" fill={palette.accent} opacity={0.9} />
      )}
      {spec.bandolier && (
        <g>
          <path d="M126 250 L198 360 L186 370 L116 260 Z" fill={palette.garment} stroke={palette.accent} strokeWidth={1} />
          {[0, 1, 2, 3].map((i) => (
            <circle key={i} cx={138 + i * 16} cy={266 + i * 24} r={3.5} fill={palette.accent} />
          ))}
        </g>
      )}
      {spec.pendant && (
        <g>
          <line x1={160} y1={240} x2={160} y2={262} stroke={palette.metal} strokeWidth={2} />
          <circle cx={160} cy={270} r={8} fill={palette.accent} opacity={0.95} />
          <circle cx={160} cy={270} r={17} fill={palette.accent} opacity={r2(0.16 + flicker * 0.14)} />
          {/* cupped light rising from below */}
          <path d="M132 372 C 140 340 180 340 188 372 Z" fill={palette.accent} opacity={0.14} />
          <circle cx={160} cy={360} r={10} fill={palette.accent} opacity={0.4} />
          <circle cx={160} cy={360} r={22} fill={palette.accent} opacity={0.12} />
        </g>
      )}
      {spec.antennae && (
        <g stroke={palette.rim} strokeWidth={2}>
          <line x1={146} y1={116} x2={136} y2={86} />
          <line x1={174} y1={116} x2={184} y2={86} />
          <circle cx={136} cy={83} r={4} fill={palette.rim} />
          <circle cx={184} cy={83} r={4} fill={palette.rim} />
        </g>
      )}
      {spec.specs && (
        <g stroke={palette.metal} strokeWidth={2} fill="none">
          <circle cx={146} cy={150} r={11} />
          <circle cx={174} cy={150} r={11} />
          <line x1={157} y1={150} x2={163} y2={150} />
        </g>
      )}
      {spec.panel && (
        <>
          <line x1={160} y1={112} x2={160} y2={190} stroke={palette.skinShade} strokeWidth={1.5} opacity={0.6} />
          <line x1={132} y1={132} x2={146} y2={132} stroke={palette.skinShade} strokeWidth={1.5} opacity={0.6} />
          <circle cx={160} cy={120} r={2} fill={palette.accent} />
        </>
      )}
      {spec.scales && (
        <g fill={palette.skinShade} opacity={0.5}>
          <path d="M138 172 a4 4 0 0 1 8 0 Z" />
          <path d="M150 178 a4 4 0 0 1 8 0 Z" />
          <path d="M162 178 a4 4 0 0 1 8 0 Z" />
          <path d="M174 172 a4 4 0 0 1 8 0 Z" />
        </g>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ shell */

export default function AvatarPreview({ traits, badges = true, className }: Props) {
  const spec = useMemo(() => avatarSpec(traits), [traits]);
  const seed = `${traits.species}|${traits.role}|${traits.vibe}|${traits.quirk}`;
  const uid = seed.replace(/[^a-z0-9]/gi, "");
  const flicker = hashUnit(seed);
  const pal = spec.palette;

  // morality cools/heats the ambient light and adds a halo (pure) or spikes (chaos)
  const glow = spec.chaos > 0.62 ? "#ff5a4d" : spec.chaos < 0.35 ? pal.rim : pal.glow;
  const moteCount = Math.round(4 + spec.expr * 9);
  const headTilt = r2(-spec.posture * 4);
  const headLift = r2(-spec.posture * 3);

  return (
    <div className={`relative ${className ?? ""}`}>
      <svg
        viewBox="0 0 320 400"
        className="h-auto w-full rounded-[26px] border border-white/10"
        role="img"
        aria-label={`${traits.vibe} ${traits.species} ${traits.role} portrait`}
      >
        <defs>
          <linearGradient id={`bg-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={pal.bgFrom} />
            <stop offset="1" stopColor={pal.bgTo} />
          </linearGradient>
          <radialGradient id={`glow-${uid}`} cx="50%" cy="36%" r="58%">
            <stop offset="0" stopColor={glow} stopOpacity="0.5" />
            <stop offset="1" stopColor={glow} stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`fig-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={pal.garment} />
            <stop offset="1" stopColor="#05040a" />
          </linearGradient>
          <linearGradient id={`skin-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={pal.skin} />
            <stop offset="1" stopColor={pal.skinShade} />
          </linearGradient>
        </defs>

        <rect width="320" height="400" fill={`url(#bg-${uid})`} />
        <ellipse cx="160" cy="150" rx="160" ry="150" fill={`url(#glow-${uid})`} />

        {/* purity halo / chaos spikes behind the head */}
        {spec.chaos < 0.35 && (
          <circle cx="160" cy="140" r="58" fill="none" stroke={pal.rim} strokeOpacity="0.35" strokeWidth="2" />
        )}
        {spec.chaos > 0.68 && (
          <g stroke="#ff5a4d" strokeOpacity="0.4" strokeWidth="2">
            {Array.from({ length: 10 }).map((_, i) => {
              const a = (i / 10) * Math.PI * 2;
              return (
                <line
                  key={i}
                  x1={r2(160 + Math.cos(a) * 52)}
                  y1={r2(140 + Math.sin(a) * 52)}
                  x2={r2(160 + Math.cos(a) * 66)}
                  y2={r2(140 + Math.sin(a) * 66)}
                />
              );
            })}
          </g>
        )}

        {/* drifting motes — count follows emotionality */}
        {Array.from({ length: moteCount }).map((_, i) => {
          const r = hashUnit(seed + i);
          return (
            <circle
              key={i}
              cx={r2(28 + r * 264)}
              cy={r2(36 + hashUnit(seed + "y" + i) * 330)}
              r={r2(0.7 + r * 1.9)}
              fill={pal.rim}
              opacity={r2(0.12 + r * 0.35)}
            />
          );
        })}

        <Extras spec={spec} flicker={flicker} />
        <Body spec={spec} uid={uid} />
        {spec.prop === "sword" && <Prop spec={spec} flicker={flicker} />}
        <Collar spec={spec} />
        <Hood spec={spec} />

        {/* neck */}
        {!spec.ghostTail && (
          <path
            d={
              spec.bigEyes
                ? "M152 196 L168 196 L170 240 L150 240 Z"
                : "M150 196 L170 196 L173 240 L147 240 Z"
            }
            fill={`url(#skin-${uid})`}
            opacity={spec.translucent ? 0.55 : 1}
          />
        )}

        {/* head */}
        <g
          transform={`rotate(${headTilt} ${HEAD_CX} ${HEAD_CY}) translate(${HEAD_CX} ${r2(HEAD_CY + 6 + headLift)}) scale(1.12) translate(${-HEAD_CX} ${-HEAD_CY})`}
          opacity={spec.translucent ? 0.6 : 1}
        >
          <Hair spec={spec} />
          <Ears spec={spec} />
          <g fill={`url(#skin-${uid})`} stroke={pal.skinShade} strokeWidth={1}>
            {headPath(spec.head)}
          </g>
          {spec.split && (
            <path
              d={`M160 108 L196 132 L190 176 L160 194 Z`}
              fill={pal.metal}
              opacity={0.9}
              stroke="#00000044"
            />
          )}
          {spec.snout && (
            <g>
              <path
                d="M144 150 C 142 172 150 190 160 190 C 170 190 178 172 176 150 Z"
                fill={`url(#skin-${uid})`}
                stroke={pal.skinShade}
                strokeWidth={1}
              />
              <ellipse cx={154} cy={182} rx={2} ry={2.6} fill={pal.skinShade} />
              <ellipse cx={166} cy={182} rx={2} ry={2.6} fill={pal.skinShade} />
              <path d="M150 174 Q 160 178 170 174" fill="none" stroke={pal.skinShade} strokeWidth={1.4} />
            </g>
          )}
          <Horns spec={spec} />
          {spec.echo && (
            <>
              <g transform="translate(-13 4)" opacity={0.22} fill={pal.rim}>
                {headPath(spec.head)}
              </g>
              <g transform="translate(11 -5)" opacity={0.3} fill="none" stroke={pal.rim} strokeWidth={1.5}>
                {headPath(spec.head)}
              </g>
            </>
          )}
          <Face spec={spec} flicker={flicker} />
          <FaceCover spec={spec} />
          <Headgear spec={spec} />
        </g>

        {spec.prop !== "none" && spec.prop !== "sword" && (
          <Prop spec={spec} flicker={flicker} />
        )}

        {spec.orb && (
          <g className="animate-orb">
            <circle cx={236} cy={244} r={11} fill={pal.accent} opacity={0.9} />
            <circle cx={236} cy={244} r={19} fill={pal.accent} opacity={0.2} />
          </g>
        )}

        <rect x="4" y="4" width="312" height="392" rx="24" fill="none" stroke="rgba(255,255,255,0.12)" />
      </svg>

      {badges && (
        <>
          <span className="absolute left-3 top-3 rounded-full border border-white/15 bg-black/40 px-3 py-1 text-xs tracking-wide backdrop-blur">
            {traits.species}
          </span>
          <span className="absolute right-3 top-3 rounded-full border border-white/15 bg-black/40 px-3 py-1 text-xs tracking-wide backdrop-blur">
            {traits.role}
          </span>
          <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-gold/40 bg-black/50 px-3 py-1 text-xs uppercase tracking-[0.2em] text-gold-soft backdrop-blur">
            {traits.vibe}
          </span>
        </>
      )}
    </div>
  );
}
