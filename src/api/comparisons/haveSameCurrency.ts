import type { Money } from "mod";
import { computeBase } from "utils/index.ts";

const haveSameCurrencyPair = (m1: Money, m2: Money): boolean => {
  const { currency: c1 } = m1;
  const { currency: c2 } = m2;

  return (
    c1.code === c2.code &&
    computeBase(c1.base) === computeBase(c2.base) &&
    c1.exponent === c2.exponent
  );
};

/**
 * Check whether a set of Money objects have the same currency.
 * @param monetaObjects Money objects in a array
 * @returns boolean
 * @example // Compare two objects with the same currency
 * import { Money, haveSameCurrency, USD } from "jsr:@quarzo-life/moneta"
 *
 * const d1 = money({ amount: 1000n, currency: USD });
 * const d2 = money({ amount: 2000n, currency: USD });
 *
 * haveSameCurrency([d1, d2]); // true
 *
 * @example // Compare two objects with different currencies
 * import { Money, haveSameCurrency, USD, EUR } from "jsr:@quarzo-life/moneta"
 *
 * const d1 = money({ amount: 1000n, currency: USD });
 * const d2 = money({ amount: 10000n, currency: EUR });
 *
 * haveSameCurrency([d1, d2]); // false
 */
export const haveSameCurrency = (
  monetaObjects: ReadonlyArray<Money>,
): boolean => {
  const [firstMoney, ...otherMoneys] = monetaObjects;
  return otherMoneys.every((d) => haveSameCurrencyPair(firstMoney, d));
};
