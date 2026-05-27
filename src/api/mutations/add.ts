import { UNEQUAL_CURRENCIES_MESSAGE } from "messages";
import { type Money, money } from "mod";
import { assert } from "helpers/assert.ts";
import { haveSameCurrency, normalizeScale } from "api/index.ts";

/**
 * Add two Money object
 * @param m1 Money object
 * @param extras Money object, one or more object
 * @returns monata object
 * @example // To add many Money object
 * import { Money, add, USD } from "jsr:@quarzo-life/moneta"
 *
 * const first = money({ amount: 300n, currency: USD });
 * const second = money({ amount: 200n, currency: USD });
 * const third = money({ amount: 100n, currency: USD });
 *
 * const addMany = (addends: Money[]) => addends.reduce(add);
 *
 * addMany([first, second, third]); // a Money object with amount 600
 */
export const add = (first: Money, second: Money): Money => {
  assert(haveSameCurrency([first, second]), UNEQUAL_CURRENCIES_MESSAGE);

  const [normalizedFirst, normalizedSecond] = normalizeScale([first, second]);

  const { currency, scale } = normalizedFirst;

  const amount = normalizedFirst.amount + normalizedSecond.amount;

  return money({ amount, currency, scale });
};
