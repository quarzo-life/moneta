import { absolute } from "./absolute.ts";

/**
 * Greatest common divisor of two bigints (always non-negative).
 * @param a first value.
 * @param b second value.
 * @returns gcd(|a|, |b|), with gcd(0, 0) = 0.
 */
export const gcd = (a: bigint, b: bigint): bigint => {
  let x = absolute(a);
  let y = absolute(b);

  while (y !== 0n) {
    [x, y] = [y, x % y];
  }

  return x;
};
