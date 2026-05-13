import { assert } from "helpers/assert.ts";
import { INVALID_RATIOS_MESSAGE } from "messages";
import { type Money, money } from "mod";
import { ScaledAmount } from "types/types.ts";
import { distribute, getAmountAndScale } from "utils/index.ts";
import { transformScale } from "api/index.ts";

export type AllocateParams = readonly [
  monetaObject: Money,
  ratios: ReadonlyArray<ScaledAmount | number>,
];

/**
 * Distribute the amount of a {@link Money} object across a list of ratios.
 *
 * Monetary values have indivisible units, meaning you can't always exactly
 * split them. With `allocate`, you can split a monetary amount then distribute
 * the remainder as evenly as possible.
 *
 * You can use percentage or ratio style for `ratios`: `[25, 75]` and `[1, 3]`
 * do the same thing. You can also pass zero ratios (such as `[0, 50, 50]`).
 * If there's a remainder to distribute, zero ratios are skipped and return a
 * Money object with amount zero.
 *
 * If you need to use fractional ratios, you shouldn't use floats, but scaled
 * amounts instead. For example, instead of passing `[50.5, 49.5]`, you should
 * pass `[{ amount: 505n, scale: 1 }, { amount: 495n, scale: 1 }]`. When using
 * scaled amounts, the function converts the returned objects to the safest scale.
 *
 * **All ratios must be positive, and you can't only pass zero ratios.**
 *
 * @param monetaryObject - The Money object to allocate from.
 * @param ratios - The ratios to allocate the amount to. Accepts plain numbers
 *   (scale 0) or scaled amount objects `{ amount: bigint, scale: number }`.
 *   The scale of the returned objects depends on the type of ratios provided:
 *   - **Plain numbers** (scale 0): results share the scale of `monetaryObject`.
 *   - **Scaled objects** `{ amount, scale }`: results use the scale of
 *     `monetaryObject` plus the highest scale found among the ratios.
 * @returns An array of Money objects with the allocated amounts, in the same
 *   order as the provided ratios.
 *
 * @example Allocate to percentages
 * ```ts
 * const m = money({ amount: 500n, currency: EUR });
 * const [m1, m2] = allocate(m, [50, 50]);
 *
 * m1; // a Money object with amount 250
 * m2; // a Money object with amount 250
 * ```
 *
 * @example Allocate to ratios
 * ```ts
 * const m = money({ amount: 100n, currency: EUR });
 * const [m1, m2] = allocate(m, [1, 3]);
 *
 * m1; // a Money object with amount 25
 * m2; // a Money object with amount 75
 * ```
 *
 * @example Distribute as fairly as possible
 * ```ts
 * const m = money({ amount: 1003n, currency: EUR });
 * const [m1, m2] = allocate(m, [50, 50]);
 *
 * m1; // a Money object with amount 502
 * m2; // a Money object with amount 501
 * ```
 *
 * @example Ignore zero ratios
 * ```ts
 * const m = money({ amount: 1003n, currency: EUR });
 * const [m1, m2, m3] = allocate(m, [0, 50, 50]);
 *
 * m1; // a Money object with amount 0
 * m2; // a Money object with amount 502
 * m3; // a Money object with amount 501
 * ```
 *
 * @example Use scaled ratios and convert to the safest scale
 * ```ts
 * const ratios = [
 *   { amount: 505n, scale: 1 },
 *   { amount: 495n, scale: 1 },
 * ]; // translates to ratios 50.5 and 49.5
 *
 * const m = money({ amount: 100n, currency: EUR });
 * const [m1, m2] = allocate(m, ratios);
 *
 * m1; // a Money object with amount 505 and scale 3
 * m2; // a Money object with amount 495 and scale 3
 * ```
 */
export function allocate(...[monetaObject, ratios]: AllocateParams): Money[] {
  const hasRatios = ratios.length > 0;
  const scaledRatios = ratios.map((ratio) => getAmountAndScale(ratio));
  const highestRatioScale = hasRatios
    ? Math.max(...scaledRatios.map(({ scale }) => scale))
    : 0;
  const normalizedRatios = scaledRatios.map(({ amount, scale }) => {
    const factor = scale === highestRatioScale ? 0 : highestRatioScale - scale;

    return {
      amount: amount * (10n ** BigInt(factor)),
      scale,
    };
  });
  const hasOnlyPositiveRatios = normalizedRatios.every(({ amount }) =>
    amount >= 0
  );
  const hasOneNonZeroRatio = normalizedRatios.some(({ amount }) => amount > 0);

  const condition = hasRatios && hasOnlyPositiveRatios && hasOneNonZeroRatio;
  assert(condition, INVALID_RATIOS_MESSAGE);

  const { scale } = monetaObject;
  const newScale = scale + highestRatioScale;

  const scaled = transformScale(monetaObject, newScale);
  const { amount, currency } = scaled;
  const shares = distribute(amount, normalizedRatios.map((r) => r.amount));

  return shares.map((share) => money({ amount: share, currency, scale: newScale }));
}
