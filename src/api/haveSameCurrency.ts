import type { Money } from "../../mod.ts";
import { computeBase } from "../utils/index.ts";

/**
 * Check whether a set of Money objects have the same currency.
 * @param monetaObjects Money objects in a array
 * @returns boolean
 * @example // Compare two objects with the same currency
 * import { Money, haveSameCurrency, USD } from "jsr:@b-life-org/moneta"
 *
 * const d1 = new Money({ amount: 1000n, currency: USD });
 * const d2 = new Money({ amount: 2000n, currency: USD });
 *
 * haveSameCurrency([d1, d2]); // true
 *
 * @example // Compare two objects with different currencies
 * import { Money, haveSameCurrency, USD, EUR } from "jsr:@b-life-org/moneta"
 *
 * const d1 = new Money({ amount: 1000n, currency: USD });
 * const d2 = new Money({ amount: 10000n, currency: EUR });
 *
 * haveSameCurrency([d1, d2]); // false
 */
export const haveSameCurrency = (
  monetaObjects: ReadonlyArray<Money>,
): boolean => {
  const [firstMoney, ...otherMoneys] = monetaObjects;
  const { currency: comparator } = firstMoney;
  const comparatorBase = computeBase(comparator.base);

  return otherMoneys.every((d) => {
    const { currency: subject } = d;
    const subjectBase = computeBase(subject.base);

    return (
      subject.code === comparator.code &&
      subjectBase === comparatorBase &&
      subject.exponent === comparator.exponent
    );
  });
};
