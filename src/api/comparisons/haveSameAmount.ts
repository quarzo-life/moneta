import type { Money } from "money/index.ts";
import { normalizeScale } from "api/conversions/normalizeScale.ts";

const haveSameAmountPair = (first: Money, second: Money): boolean => {
  const [normalizedFirst, normalizedSecond] = normalizeScale([first, second]);
  return normalizedFirst.amount === normalizedSecond.amount;
};

/**
 * Check whether a set of Money objects have the same amount.
 * @param monetaObjects moneta objects in a array
 * @returns
 * @example // Compare two objects with different amount
 * import { Money, haveSameAmount, USD } from "jsr:@quarzo-life/moneta"
 *
 * const first = money({ amount: 1000n, currency: USD });
 * const second = money({ amount: 2000n, currency: USD });
 *
 * haveSameAmount([first, second]); // false
 *
 * @example // Compare two objects with the same amount once normalized
 * import { Money, haveSameAmount, USD } from "jsr:@quarzo-life/moneta"
 *
 * const first = money({ amount: 1000n, currency: USD });
 * const second = money({ amount: 10000n, currency: USD, scale: 3  });
 *
 * haveSameAmount([first, second]); // true
 */
export const haveSameAmount = (
  monetaObjects: ReadonlyArray<Money>,
): boolean => {
  const [first, ...others] = monetaObjects;
  return others.every((second) => haveSameAmountPair(first, second));
};
