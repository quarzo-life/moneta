import { type Money } from "mod";
import { DivideOperation } from "types/types.ts";
import { transformScale } from "api/conversions/transformScale.ts";

/**
 * Round a Money object to its currency's conventional scale (the exponent).
 *
 * **Danger**: sub-unit precision beyond the currency exponent is permanently lost.
 * For example, rounding a USD object at scale 3 to scale 2 discards the
 * thousandths-of-a-cent digit with no way to recover it.
 *
 * If the object's scale is already at or below the currency exponent, it is
 * returned unchanged (no-op).
 *
 * The rounding strategy must be provided explicitly — there is no default —
 * to make the loss of precision a deliberate choice.
 *
 * @param monetaObject - The Money object to round.
 * @param divideOp - The rounding function applied to the dropped digits
 *   (e.g. {@link down}, {@link up}, {@link halfUp}).
 * @returns A new Money object at `currency.exponent` scale, or the original
 *   object if no rounding was needed.
 *
 * @see transformScale
 * @see trimScale
 *
 * @example Round to cents (USD exponent = 2)
 * ```ts
 * import { money, dangerRound, down, up, halfUp, USD } from "jsr:@quarzo-life/moneta";
 *
 * const m = money({ amount: 12345n, currency: USD, scale: 3 }); // $12.345
 *
 * dangerRound(m, down);   // amount: 1234n, scale: 2  ($12.34 — $0.005 lost)
 * dangerRound(m, up);     // amount: 1235n, scale: 2  ($12.35 — $0.005 lost)
 * dangerRound(m, halfUp); // amount: 1235n, scale: 2  ($12.35)
 * ```
 *
 * @example No-op when already at or below the currency exponent
 * ```ts
 * const m = money({ amount: 1000n, currency: USD, scale: 2 }); // $10.00
 *
 * dangerRound(m, down); // returns m unchanged
 * ```
 *
 * @example Round to whole units (JPY exponent = 0)
 * ```ts
 * import { JPY } from "jsr:@quarzo-life/moneta";
 *
 * const m = money({ amount: 12345n, currency: JPY, scale: 2 }); // ¥123.45
 *
 * dangerRound(m, down); // amount: 123n, scale: 0  (¥123 — ¥0.45 lost)
 * dangerRound(m, up);   // amount: 124n, scale: 0  (¥124)
 * ```
 */
export const dangerRound = (
  monetaObject: Money,
  divideOp: DivideOperation,
): Money => {
  const { currency, scale } = monetaObject;

  if (scale <= currency.exponent) {
    return monetaObject;
  }

  return transformScale(monetaObject, currency.exponent, divideOp);
};
