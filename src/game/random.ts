/** Deterministic, seeded pseudo-randomness for reproducible runs. */

export function makeSeed(): number {
  return Math.floor(Math.random() * 2 ** 31);
}

/** mulberry32 — small, fast, good enough for narrative variation */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function next(): number {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function seededPick<T>(rng: () => number, arr: readonly T[]): T {
  if (arr.length === 0) throw new Error("seededPick: empty array");
  return arr[Math.floor(rng() * arr.length)] as T;
}

/** derive an independent stream from a base seed + salt */
export function subSeed(seed: number, salt: number): number {
  return (Math.imul(seed ^ salt, 0x9e3779b1) >>> 0) % 2 ** 31;
}
