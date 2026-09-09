# Loreloom

**Weave a character. Discover their story.**

Loreloom is a short, replayable narrative game. You choose who a character
*appears* to be — species, role, vibe, quirk, and three temperament dials — then
play a seven-chapter story set in the burning city of Vantry. Your choices move
hidden stats, set flags, and route the branch you travel. When the story ends,
the game reads the whole playthrough back and awards a **character card**: the
person they actually became, which is rarely the person you started with.

The entire game runs locally. No account, no database, no network call is
required to play from the first screen to the earned card.

---

## Design constraints

These are load-bearing and the code is structured around them:

- **Zero-API playability.** The core loop — creation → story → stats → archetype
  → ending → card — is pure TypeScript with no I/O. An Anthropic key is *optional*
  and only rewrites two prose fields on the final card.
- **Deterministic.** All randomness flows through a seeded PRNG (`mulberry32`).
  The same traits and seed always produce the same run, so "Play again" and the
  in-code example runs are exact replays.
- **Engine separate from UI.** Everything in `src/game/` is framework-free and
  unit-tested. React components read the engine; they never contain game rules.
- **No hidden numbers mid-game.** The story surfaces only your top instincts by
  name. The archetype and ending are computed but not revealed until the run is
  over.
- **Installable.** It ships a web manifest and a service worker, so on a phone it
  installs to the home screen and — because nothing needs the network — keeps
  working fully offline.

---

## Stack

| | |
|---|---|
| Runtime / package manager | [Bun](https://bun.sh) 1.3 |
| Framework | Next.js 16 (Pages Router, Turbopack) |
| UI | React 19 + the React Compiler |
| Styling | Tailwind CSS v4 (`@theme` tokens, no config file) |
| Language | TypeScript 5 (`strict`, no `any`) |
| Icons | `lucide-react` |
| Optional model call | `@anthropic-ai/sdk` + `zod` structured output |
| Tests | `bun test` |

---

## Getting started

```bash
bun install
bun run dev          # http://localhost:3000
```

Optional — enable the Claude prose enhancement on the final card:

```bash
cp .env.local.example .env.local
# set ANTHROPIC_API_KEY=...
```

Without a key the card is still complete; it just carries the deterministic
local text and a "Forged by Loreloom" mark instead of "Refined with Claude".

### Scripts

```bash
bun run dev          # dev server
bun run build        # production build
bun run start        # serve the production build
bun run lint         # eslint (next/core-web-vitals + typescript)
bun run typecheck    # tsc --noEmit
bun run test         # engine unit tests
```

---

## Project layout

```
src/
  game/                 the deterministic engine — no React, no I/O
    types.ts            state model: stats, hidden axes, scenes, endings, card
    random.ts           mulberry32 PRNG, seeded pick, sub-seeding
    rules.ts            curated trait -> stat/hidden modifier tables
    stats.ts            init & apply effects, clamped 0..100
    archetypes.ts       18 archetypes, weighted scoring, expected vs. actual
    scenes.ts           "Ashfall": 7 chapters, branch at ch.2 and ch.4
    engine.ts           startGame / applyChoice / requirements / routing / replay
    endings.ts          15 endings, first-matching-rule resolution
    card.ts             archetype drift, rarity, palette, local legacy prose
    names.ts            per-species name generation
    game.test.ts        exhaustive DFS over every route + invariant checks

  lib/
    avatar.ts           avatarSpec(): species owns silhouette, role owns kit,
                        sliders drive posture / light / expression
    traits.ts           the selectable options and their icons
    storage.ts          localStorage-backed saved runs (useSyncExternalStore)
    enhance.ts          client call to the optional /api/enhance route
    share.ts            Web Share API with a clipboard fallback

  components/
    CharacterCreator    trait pickers + live portrait
    StoryStage          one scene: setup, choices, consequence, continue
    FinalReveal         the earned reveal — card, ledger, path, ending
    EarnedCard          the collectible; four alignment families, rarity finish

  pages/
    index.tsx           the whole game as a view state machine
    saved.tsx           the collection
    api/enhance.ts      optional; validates input, never returns an error status
```

---

## How a run is scored

1. **Creation.** Species / role / vibe / quirk and the Morality, Confidence and
   Emotionality dials each contribute non-linear modifiers (`src/game/rules.ts`)
   to eight core stats — *courage, cunning, empathy, ambition, discipline, chaos,
   curiosity, trust* — and eight hidden personality axes. The starting snapshot
   implies an "expected" archetype.
2. **Story.** Each choice applies stat and hidden-axis effects, sets flags,
   accrues archetype weight, records a `DecisionRecord`, and returns the next
   scene. Some choices are gated behind stat thresholds or earlier flags.
3. **Archetype.** The final archetype blends the end-state stat snapshot with the
   choice-driven weight accrued along the way. If it differs from the expected
   one, the card says you *drifted* ("The Reluctant Protector"); if not, you were
   *always* that ("The True Opportunist").
4. **Ending.** A priority list of rules keyed on final-decision flags and
   stat/hidden thresholds; the first match wins, with a fallback.
5. **Card.** Name, archetype title, opening/became lines, three core stats,
   signature, strength, flaw, a legacy paragraph assembled from the actual flags,
   an ending narrative, and a rarity (Common → Legendary) derived from
   *interesting combinations*, not raw score.

---

## Tests

```bash
bun run test
```

`src/game/game.test.ts` covers, among other things:

- every one of the 12⁴ × 3 starting trait combinations initialises in range,
- a full depth-first search of every reachable choice path terminates at a valid
  ending with stats in `[0, 100]` and a fully-formed card,
- replay keeps identity but resets the story,
- the archetype can legitimately diverge from the expected self,
- invalid choice ids throw instead of corrupting state.

---

## PWA

`public/manifest.webmanifest` and `public/sw.js` make the app installable. The
service worker is registered only in production (`_app.tsx`), precaches the
shell, serves navigations network-first with a cached fallback, and serves the
hashed build assets cache-first. Bump `VERSION` in `sw.js` to force a refresh.

Icons are generated from `public/icon.svg` (and `icon-maskable.svg`) — regenerate
the PNGs if you change the source art.

## Deploy

Any static-capable Node host works; the only server code is the optional
`/api/enhance` route.

```bash
bun run build
bun run start        # or deploy the .next output to Vercel / a Node host
```

Set `ANTHROPIC_API_KEY` in the host's environment to turn on the Claude
enhancement in production. Nothing else is required — no database, no other
secrets.

## The optional model call

`POST /api/enhance` takes the already-computed outcome and asks Claude
(`claude-opus-5`, low effort, `zod` structured output) for two short prose
pieces — a legacy line and an epilogue — consistent with the deterministic
result. It **never** returns a non-200: a missing key, malformed input, a
refusal, a timeout, or any exception all resolve to `{ "enhanced": false }`, and
the client keeps the local text. The API key is read server-side only and is
never exposed to the bundle.

---

## Author

**Yatin Annam** — [GitHub](https://github.com/yatinannam) ·
[LinkedIn](https://www.linkedin.com/in/yatinannam)

## License

[MIT](./LICENSE) © 2026 Yatin Annam
