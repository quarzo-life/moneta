import { Money } from "../helpers/createMoney.ts";
import { ScaledAmount } from "../types/types.ts";
import { getAmountAndScale } from "../utils/index.ts";
import { transformScale } from "./transformScale.ts";

export type MultiplyParams = readonly [
  multiplicand: Money,
  multiplier: ScaledAmount | number,
];

/**
 * Multiply a Money object.
 *
 * If you need to multiply by a fractional multiplier, you shouldn't use floats, but scaled amounts instead.
 * For example, instead of passing 2.1, you should pass { amount: 21, scale: 1 }.
 * When using scaled amounts, the function converts the returned objects to the safest scale.
 *
 * @param multiplicand Money object
 * @param multiplier multiplier : ScaledAmount | number ex :  { amount: 21n, scale: 1 } or 3
 * @returns Money object
 * @example // Multiply by an integer
 * import { Money, multiply, EUR } from "jsr:@b-life-org/moneta"

const d = new Money({ amount: 400n, currency: EUR });

multiply(d, 4); // a Money object with amount 1600

* @example // Multiply by a scaled multiplier
 * import { Money, multiply, EUR } from "jsr:@b-life-org/moneta"

const d = new Money({ amount: 401n, currency: EUR });

multiply(d, { amount: 2001, scale: 3 }); // a Money object with amount 802401 and scale 5

 */
export const multiply = (
  ...[multiplicand, multiplier]: MultiplyParams
): Money => {
  const { amount, currency, scale } = multiplicand;

  const { amount: multiplierAmount, scale: multiplierScale } =
    getAmountAndScale(multiplier);

  const newScale = scale + multiplierScale;

  return transformScale(
    new Money({
      amount: amount * multiplierAmount,
      currency,
      scale: newScale,
    }),
    newScale,
  );
};
