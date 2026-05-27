import { type Money, money } from "mod";
import { DivideOperation, ScaledAmount } from "types/types.ts";
import { getAmountAndScale } from "utils/index.ts";

/**
 * Divide a Money object by a scalar divisor.
 *
 * **Danger**: the remainder is permanently discarded. Use {@link allocate} instead
 * if you need to distribute the remainder fairly across recipients.
 *
 * The divisor can be a plain integer, a `bigint`, or a {@link ScaledAmount}
 * for fractional divisors (e.g. `{ amount: 5n, scale: 1 }` = 0.5).
 * The rounding strategy must be provided explicitly — there is no default —
 * to make the loss of precision a deliberate choice.
 *
 * @param monetaObject - The Money object to divide.
 * @param divisor - The value to divide by. Accepts a plain number, bigint, or
 *   a scaled amount `{ amount: bigint, scale: number }` for fractional divisors.
 * @param divideOp - The rounding function applied when the division is not exact
 *   (e.g. {@link down}, {@link up}, {@link halfUp}).
 * @returns A new Money object at the same scale as the input.
 *
 * @see allocate
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
 */
export const dangerDivide = (
  monetaObject: Money,
  divisor: ScaledAmount | number | bigint,
  divideOp: DivideOperation,
): Money => {
  const { amount, currency, scale } = monetaObject;

  const { amount: divisorAmount, scale: divisorScale } = getAmountAndScale(
    divisor,
  );

  const scaledAmount = amount * (10n ** BigInt(divisorScale));

  const newAmount = divideOp(scaledAmount, divisorAmount);

  return money({ amount: newAmount, currency, scale });
};
