import type { Money } from "mod";
import { normalizeScale } from "api/conversions/normalizeScale.ts";

const haveSameAmountPair = (m1: Money, m2: Money): boolean => {
  const [normalizedM1, normalizedM2] = normalizeScale([m1, m2]);
  return normalizedM1.amount === normalizedM2.amount;
};

/**
 * Check whether a set of Money objects have the same amount.
 * @param monetaObjects moneta objects in a array
 * @returns
 * @example // Compare two objects with different amount
 * import { Money, haveSameAmount, USD } from "jsr:@quarzo-life/moneta"
 *
 * const d1 = money({ amount: 1000n, currency: USD });
 * const d2 = money({ amount: 2000n, currency: USD });
 *
 * haveSameAmount([d1, d2]); // false
 *
 * @example // Compare two objects with the same amount once normalized
 * import { Money, haveSameAmount, USD } from "jsr:@quarzo-life/moneta"
 *
 * const d1 = money({ amount: 1000n, currency: USD });
 * const d2 = money({ amount: 10000n, currency: USD, scale: 3  });
 *
 * haveSameAmount([d1, d2]); // true
 */
export const haveSameAmount = (
  monetaObjects: ReadonlyArray<Money>,
): boolean => {
  const [firstMoney, ...otherMoneys] = monetaObjects;
  return otherMoneys.every((d) => haveSameAmountPair(firstMoney, d));
};
