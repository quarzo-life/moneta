import { Money } from "../../mod.ts";
import { computeBase, countTrailingZeros } from "../utils/index.ts";
import { transformScale } from "./transformScale.ts";

export type TrimScaleParams = readonly [monetaObject: Money];

/**
 * Trim a Money object's scale as much as possible, down to the currency exponent.
 * @param monetaObject Money object to trim.
 * @returns Money object
 * @example // Trim an object down to its currency exponent's scale
 * import { Money, trimScale, EUR } from "jsr:@quarzo-life/moneta"
 * const m = new Money({ amount: 500000n, currency: EUR, scale: 5 });
 *
 * trimScale(m); // a Money object with amount 500 and scale 2
 *
 * @example // Trim an object down to the safest possible scale
 * import { Money, trimScale, EUR } from "jsr:@quarzo-life/moneta"
 *
 * const d = new Money({ amount: 99950, currency: USD, scale: 4 });
 *
 * trimScale(d); // a Dinero object with amount 9995 and scale 3
 */
export const trimScale = (...[monetaObject]: TrimScaleParams): Money => {
  const { amount, currency, scale } = monetaObject;
  const base = computeBase(currency.base);

  const trailingZerosLength = countTrailingZeros(amount, base);
  const difference = scale - trailingZerosLength;
  const newScale = Math.max(difference, currency.exponent);

  if (newScale === scale) {
    return monetaObject;
  }

  return transformScale(monetaObject, newScale);
};
