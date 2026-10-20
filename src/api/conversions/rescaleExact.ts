import { INEXACT_RESCALE_MESSAGE, INVALID_SCALE_MESSAGE } from "messages";
import { assert } from "helpers/assert.ts";
import { type Money, money } from "money/index.ts";
import {
  computeBase,
  countTrailingZeros,
  getScaleFactor,
} from "utils/index.ts";

/**
 * Change a Money object's scale without ever losing precision.
 *
 * - Increasing the scale always succeeds (`1,23` → `1,2300`).
 * - Decreasing the scale succeeds only when the dropped digits are all zeros
 *   (`1,2300` → `1,23`); otherwise it throws (`1,234` → scale 2 is refused).
 * - Without `newScale`, the scale is trimmed as much as possible without loss,
 *   but never below the currency exponent (`5,00000` → `5,00`).
 *
 * Use {@link dangerTransformScale} when rounding is acceptable.
 *
 * @param monetaObject The Money object to rescale.
 * @param newScale The target scale (non-negative integer). When omitted, the
 *   smallest lossless scale greater than or equal to the currency exponent.
 * @returns a Money object at the new scale (the same object if unchanged).
 * @throws if reaching `newScale` would discard a non-zero digit.
 *
 * @see dangerTransformScale
 *
 * @example // Rescale exactly
 * import { money, rescaleExact, EUR } from "jsr:@quarzo-life/moneta"
 *
 * const m = money({ amount: 12300n, currency: EUR, scale: 4 }); // 1,2300 €
 *
 * rescaleExact(m, 2); // a Money object with amount 123 and scale 2
 * rescaleExact(m, 6); // a Money object with amount 1230000 and scale 6
 *
 * @example // Refuse to lose precision
 * import { money, rescaleExact, EUR } from "jsr:@quarzo-life/moneta"
 *
 * const m = money({ amount: 1234n, currency: EUR, scale: 3 }); // 1,234 €
 *
 * rescaleExact(m, 2); // throws
 *
 * @example // Trim down to the smallest lossless scale
 * import { money, rescaleExact, USD } from "jsr:@quarzo-life/moneta"
 *
 * rescaleExact(money({ amount: 500000n, currency: USD, scale: 5 })); // amount 500, scale 2
 * rescaleExact(money({ amount: 99950n, currency: USD, scale: 4 }));  // amount 9995, scale 3
 */
export const rescaleExact = (
  monetaObject: Money,
  newScale?: number,
): Money => {
  const { amount, currency, scale } = monetaObject;

  const base = computeBase(currency.base);

  const targetScale = newScale ??
    Math.max(scale - countTrailingZeros(amount, base), currency.exponent);

  assert(
    Number.isInteger(targetScale) && targetScale >= 0,
    INVALID_SCALE_MESSAGE,
  );

  if (targetScale === scale) {
    return monetaObject;
  }

  const factor = getScaleFactor(base, Math.abs(targetScale - scale));

  if (targetScale > scale) {
    return money({ amount: amount * factor, currency, scale: targetScale });
  }

  assert(amount % factor === 0n, INEXACT_RESCALE_MESSAGE);

  return money({ amount: amount / factor, currency, scale: targetScale });
};
