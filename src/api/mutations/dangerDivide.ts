import { INVALID_SCALE_MESSAGE } from "messages";
import { assert } from "helpers/assert.ts";
import { type Money, money } from "money/index.ts";
import { DivideOperation, ScaledAmount } from "types/types.ts";
import { computeBase, getDivision, getScaleFactor } from "utils/index.ts";

/**
 * Divide a Money object by a scalar divisor.
 *
 * **Danger**: the remainder is permanently discarded. Prefer {@link allocate}
 * whenever possible: it never loses anything to rounding, because the remainder
 * is distributed across the parts and they always sum back to the original
 * amount. Use {@link divideExact} if the division must not lose anything.
 *
 * The divisor can be a plain integer, a `bigint`, or a {@link ScaledAmount}
 * for fractional divisors (e.g. `{ amount: 5n, scale: 1 }` = 0.5).
 * The rounding strategy must be provided explicitly — there is no default —
 * to make the loss of precision a deliberate choice. The result is rounded
 * once, directly at the requested scale (no double rounding).
 *
 * @param monetaObject - The Money object to divide.
 * @param divisor - The value to divide by. Accepts a plain number, bigint, or
 *   a scaled amount `{ amount: bigint, scale: number }` for fractional divisors.
 * @param divideOp - The rounding function applied when the division is not exact
 *   (e.g. {@link down}, {@link up}, {@link halfUp}).
 * @param scale - The scale of the result (non-negative integer). Defaults to
 *   the scale of `monetaObject`.
 * @returns A new Money object at `scale`.
 * @throws if the divisor is zero.
 *
 * @see allocate
 * @see divideExact
 *
 * @example Divide by an integer
 * ```ts
 * import { money, dangerDivide, down, USD } from "jsr:@quarzo-life/moneta";
 *
 * const m = money({ amount: 1000n, currency: USD }); // $10.00
 *
 * dangerDivide(m, 3, down); // amount: 333n, scale: 2  ($3.33 — $0.01 lost)
 * ```
 *
 * @example Divide by a bigint
 * ```ts
 * const m = money({ amount: 1000n, currency: USD }); // $10.00
 *
 * dangerDivide(m, 4n, down); // amount: 250n, scale: 2  ($2.50 — exact, no loss)
 * ```
 *
 * @example Divide by a fractional ScaledAmount
 * ```ts
 * const m = money({ amount: 1000n, currency: USD }); // $10.00
 * // Dividing by 0.5 is equivalent to multiplying by 2
 * dangerDivide(m, { amount: 5n, scale: 1 }, down); // amount: 2000n, scale: 2  ($20.00)
 *
 * // Dividing by 0.3
 * dangerDivide(m, { amount: 3n, scale: 1 }, down); // amount: 3333n, scale: 2  ($33.33 — $0.003… lost)
 * ```
 *
 * @example Choose a rounding strategy
 * ```ts
 * const m = money({ amount: 1000n, currency: USD }); // $10.00
 *
 * dangerDivide(m, 3, down);   // amount: 333n  ($3.33)
 * dangerDivide(m, 3, up);     // amount: 334n  ($3.34)
 * dangerDivide(m, 3, halfUp); // amount: 333n  ($3.33)
 * ```
 *
 * @example Choose the scale of the result
 * ```ts
 * const m = money({ amount: 1000n, currency: USD }); // $10.00
 *
 * dangerDivide(m, 3, halfEven, 4); // amount: 33333n, scale: 4  ($3.3333)
 * dangerDivide(m, 3, halfEven, 0); // amount: 3n, scale: 0      ($3)
 * ```
 */
export const dangerDivide = (
  monetaObject: Money,
  divisor: ScaledAmount | number | bigint,
  divideOp: DivideOperation,
  scale: number = monetaObject.scale,
): Money => {
  assert(Number.isInteger(scale) && scale >= 0, INVALID_SCALE_MESSAGE);

  const { amount, currency } = monetaObject;

  // Rounding strategies expect a positive factor: the divisor's sign is moved
  // onto the numerator so that e.g. `down` still rounds towards -Infinity.
  const { numerator, denominator } = getDivision(amount, divisor);

  // Move the fraction to the target scale before rounding, so that it is
  // rounded only once.
  const factor = getScaleFactor(
    computeBase(currency.base),
    Math.abs(scale - monetaObject.scale),
  );

  const newAmount = scale >= monetaObject.scale
    ? divideOp(numerator * factor, denominator)
    : divideOp(numerator, denominator * factor);

  return money({ amount: newAmount, currency, scale });
};
