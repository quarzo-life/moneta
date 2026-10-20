import { INVALID_SCALE_MESSAGE } from "messages";
import { assert } from "helpers/assert.ts";
import { computeBase, getScaleFactor } from "utils/index.ts";
import { type Money, money } from "money/index.ts";
import type { DivideOperation } from "types/types.ts";

/**
 * Transform a Money object to a new scale, rounding when the scale shrinks.
 *
 * **Danger**: when transforming to a smaller scale, the dropped digits are
 * permanently lost. Use {@link rescaleExact} instead if the transformation must
 * never discard a non-zero digit.
 *
 * When transforming to a higher scale, the internal amount increases by orders
 * of magnitude and no precision is lost (prefer {@link rescaleExact} for that
 * case, which states the intent).
 *
 * The rounding strategy must be provided explicitly — there is no default —
 * to make the loss of precision a deliberate choice. Moneta provides `up`,
 * `down`, `halfUp`, `halfDown`, `halfOdd`, `halfEven` (bankers rounding),
 * `halfTowardsZero`, and `halfAwayFromZero`.
 *
 * @param monetaObject The Money object to transform.
 * @param newScale The new scale to transform to (non-negative integer).
 * @param divide The rounding function applied when reducing the scale.
 * @returns a new Money object
 *
 * @see rescaleExact
 * @see dangerRound
 *
 * @example // Reduce the scale, choosing the rounding
 * import { money, dangerTransformScale, up, down, USD } from "jsr:@quarzo-life/moneta"
 *
 * const d = money({ amount: 10455n, currency: USD, scale: 3 }); // $10.455
 *
 * dangerTransformScale(d, 2, up);   // a Money object with amount 1046 and scale 2
 * dangerTransformScale(d, 2, down); // a Money object with amount 1045 and scale 2
 */
export const dangerTransformScale = (
  monetaObject: Money,
  newScale: number,
  divide: DivideOperation,
): Money => {
  assert(
    Number.isInteger(newScale) && newScale >= 0,
    INVALID_SCALE_MESSAGE,
  );

  const { amount, currency, scale } = monetaObject;

  const isLarger = newScale > scale;

  const base = computeBase(currency.base);
  const factor = getScaleFactor(base, Math.abs(newScale - scale));

  const newAmount = isLarger ? amount * factor : divide(amount, factor);

  return money({
    amount: newAmount,
    currency,
    scale: newScale,
  });
};
