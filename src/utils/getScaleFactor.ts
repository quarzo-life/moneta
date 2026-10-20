const factorCache = new Map<string, bigint>();

/**
 * Compute `base ** diff` as a bigint, the factor that moves an amount `diff`
 * scale steps in the given base. Results are memoized.
 * @param base the numeric base of the currency (see `computeBase`).
 * @param diff the (non-negative) number of scale steps.
 * @returns the scale factor.
 */
export const getScaleFactor = (base: number, diff: number): bigint => {
  if (diff === 0) return 1n; // fast path, no need to cache
  const key = `${base}:${diff}`;
  let cached = factorCache.get(key);
  if (cached === undefined) {
    cached = BigInt(base) ** BigInt(diff);
    factorCache.set(key, cached);
  }
  return cached;
};
