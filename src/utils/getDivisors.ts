/**
 * Compute, for each position in `bases`, the product of that base with all
 * the bases that follow it. Used to derive the divisors needed to convert
 * between scales for non-decimal currencies (e.g. pre-decimal GBP).
 *
 * @param bases The currency bases, from the most to the least significant.
 * @returns The divisor for each position in `bases`.
 */
export const getDivisors = (bases: readonly number[]): readonly number[] => {
  return bases.reduce<readonly number[]>((divisors, _, i) => {
    const divisor = bases.slice(i).reduce((acc, curr) => acc * curr);

    return [...divisors, divisor];
  }, []);
};
