import { INEXACT_DIVISION_MESSAGE } from "messages";
import { assert } from "helpers/assert.ts";
import { type Money, money } from "money/index.ts";
import type { ScaledAmount } from "types/types.ts";
import { computeBase, gcd, getDivision, getScaleFactor } from "utils/index.ts";

/**
 * Divide a Money object by a scalar divisor, without any rounding.
 *
 * The result keeps the scale of the input, and grows it only as much as needed
 * to represent the quotient exactly (like `multiply`, which grows the scale
 * instead of rounding). If the quotient has no finite representation in the
 * currency's base — e.g. `1 / 3` in base 10 — it throws.
 *
 * Use {@link dangerDivide} when rounding is acceptable, {@link allocate} to
 * split an amount between recipients, and {@link rescaleExact} to bring the
 * result back to a given scale without loss.
 *
 * @param monetaObject - The Money object to divide.
 * @param divisor - The value to divide by. Accepts a plain number, bigint, or
 *   a scaled amount `{ amount: bigint, scale: number }` for fractional divisors.
 * @returns A new Money object at the smallest scale (at least the input's)
 *   that represents the quotient exactly.
 * @throws if the divisor is zero, or if the quotient isn't exactly
 *   representable in the currency's base.
 *
 * @see dangerDivide
 * @see rescaleExact
 *
 * @example Exact division at the same scale
 * ```ts
 * import { divideExact, money, USD } from "jsr:@quarzo-life/moneta";
 *
 * divideExact(money({ amount: 1000n, currency: USD }), 4); // amount: 250n, scale: 2 ($2.50)
 * ```
 *
 * @example The scale grows when needed
 * ```ts
 * divideExact(money({ amount: 100n, currency: USD }), 8); // amount: 125n, scale: 3 ($0.125)
 * ```
 *
 * @example Non-terminating quotients throw
 * ```ts
 * divideExact(money({ amount: 100n, currency: USD }), 3); // throws
 * ```
 */
export const divideExact = (
  monetaObject: Money,
  divisor: ScaledAmount | number | bigint,
): Money => {
  const { amount, currency, scale } = monetaObject;

  const { numerator, denominator } = getDivision(amount, divisor);

  const base = computeBase(currency.base);
  const baseBigInt = BigInt(base);

  // The quotient is exact at scale `scale + extraScale` iff the reduced
  // denominator divides `base ** extraScale`: strip from it the factors it
  // shares with the base, one power of the base at a time.
  let remaining = denominator / gcd(numerator, denominator);
  let extraScale = 0;

  while (remaining !== 1n) {
    const common = gcd(remaining, baseBigInt);

    assert(common !== 1n, INEXACT_DIVISION_MESSAGE);

    remaining /= common;
    extraScale++;
  }

  return money({
    amount: (numerator * getScaleFactor(base, extraScale)) / denominator,
    currency,
    scale: scale + extraScale,
  });
};
