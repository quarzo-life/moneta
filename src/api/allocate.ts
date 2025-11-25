import { assert } from "../helpers/assert.ts";
import { INVALID_RATIOS_MESSAGE } from "../../messages.ts";
import { Money } from "../../mod.ts";
import { ScaledAmount } from "../types/types.ts";
import { distribute, getAmountAndScale } from "../utils/index.ts";
import { transformScale } from "./index.ts";

type UnsafeAllocateParams = readonly [
  monetaObject: Money,
  ratios: ReadonlyArray<ScaledAmount>,
];

function unsafeAllocate(
  ...[monetaObject, ratios]: UnsafeAllocateParams
) {
  const { amount, currency, scale } = monetaObject;
  const shares = distribute(
    amount,
    ratios.map((ratio) => ratio.amount),
  );

  return shares.map((share) => {
    return new Money({
      amount: share,
      currency,
      scale,
    });
  });
}

export type AllocateParams = readonly [
  monetaObject: Money,
  ratios: ReadonlyArray<ScaledAmount | number>,
];

/**
 * Distribute the amount of a Money object across a list of ratios.
 *
 * Moneyry values have indivisible units, meaning you can't always exactly split them. With allocate, you can split a monetary amount then distribute the remainder as evenly as possible.
 *
 * You can use percentage or ratio style for ratios: [25, 75] and [1, 3] do the same thing. You can also pass zero ratios (such as [0, 50, 50]). If there's a remainder to distribute, zero ratios are skipped and return a Dinero object with amount zero.
 *
 * If you need to use fractional ratios, you shouldn't use floats, but scaled amounts instead. For example, instead of passing [50.5, 49.5], you should pass [{ amount: 505, scale: 1 }, { amount: 495, scale: 1 }]. When using scaled amounts, the function converts the returned objects to the safest scale.
 *
 * All ratios must be positive, and you can't only pass zero ratios.
 * @param monetaObject The Money object to allocate from.
 * @param ratios The ratios to allocate the amount to.
 * @returns Money objects with the allocated amounts.
 * @example Distribute as fairly as possible and Ignore zero ratios
 *
 * const m = new Money({ amount: 1003n, currency: EUR });

const [m1, m2, m3] = allocate(m, [0, 50, 50]);

console.log(m1); // a Dinero object with amount 0
console.log(m2); // a Dinero object with amount 502
console.log(m3); // a Dinero object with amount 501
 *
 * @example Use scaled ratios and convert to the safest scale
 *
const ratios = [
  { amount: 505n, scale: 1 },
  { amount: 495n, scale: 1 },
]; // translates to ratios 50.5 and 49.5
const m = new Money({ amount: 100n, currency: EUR });

const [m1, m2] = allocate(m, ratios);

console.log(m1); // a Money object with amount 505 and scale 3
console.log(m2); // a Money object with amount 495 and scale 3

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

  return unsafeAllocate(
    transformScale(monetaObject, newScale),
    normalizedRatios,
  );
}
