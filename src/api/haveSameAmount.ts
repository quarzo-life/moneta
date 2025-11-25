import type { Money } from "../../mod.ts";
import { normalizeScale } from "./normalizeScale.ts";

export type HaveSameAmountParams = readonly [
  monetaObjects: ReadonlyArray<Money>,
];

/**
 * Check whether a set of Money objects have the same amount.
 * @param monetaObjects moneta objects in a array
 * @returns
 * @example // Compare two objects with different amount
 * import { Money, haveSameAmount, USD } from "jsr:@quarzo-life/moneta"
 *
 * const d1 = new Money({ amount: 1000n, currency: USD });
 * const d2 = new Money({ amount: 2000n, currency: USD });
 *
 * haveSameAmount([d1, d2]); // false
 *
 * @example // Compare two objects with the same amount once normalized
 * import { Money, haveSameAmount, USD } from "jsr:@quarzo-life/moneta"
 *
 * const d1 = new Money({ amount: 1000n, currency: USD });
 * const d2 = new Money({ amount: 10000n, currency: USD, scale: 3  });
 *
 * haveSameAmount([d1, d2]); // true
 */
export const haveSameAmount = (
  ...[monetaObjects]: HaveSameAmountParams
): boolean => {
  const [firstMoney, ...otherMoneys] = normalizeScale(monetaObjects);
  const { amount: comparatorAmount } = firstMoney;

  return otherMoneys.every((d) => {
    const { amount: subjectAmount } = d;

    return subjectAmount === comparatorAmount;
  });
};
