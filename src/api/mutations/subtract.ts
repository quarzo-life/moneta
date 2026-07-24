import { UNEQUAL_CURRENCIES_MESSAGE } from "messages";
import { type Money, money } from "money/index.ts";
import { assert } from "helpers/assert.ts";
import { normalizeScale } from "api/conversions/normalizeScale.ts";
import { haveSameCurrency } from "api/index.ts";

/**
 * Subtract two Money objects.
 *
 * You can only subtract objects that share the same currency. The function also normalizes objects to the same scale (the highest) before subtracting them.
 * @param first The Money object to subtract from.
 * @param second The Money object to subtract from.
 * @returns a new Money object
 * @example // Subtract more than two objects
 * import { Money, subtract, USD } from "jsr:@quarzo-life/moneta"
 *
 * const first = money({ amount: 400n, currency: USD });
 * const second = money({ amount: 200n, currency: USD });
 * const third = money({ amount: 100n, currency: USD });
 *
 * const subtractMany = (subtrahends: Money[]) => subtrahends.reduce(subtract);
 *
 * subtractMany([first, second, third]); // a Money object with amount 100
 * @example // Subtract objects with a different scale
 * import { Money, subtract, USD } from "jsr:@quarzo-life/moneta"
 *
 * const first = money({ amount: 500n, currency: USD });
 * const second = money({ amount: 1000n, currency: USD, scale: 3 });
 *
 * subtract(first, second); // a Money object with amount 4000 and scale 3
 */
export const subtract = (first: Money, second: Money): Money => {
  assert(haveSameCurrency([first, second]), UNEQUAL_CURRENCIES_MESSAGE);

  const [normalizedFirst, normalizedSecond] = normalizeScale([first, second]);

  const { currency, scale } = normalizedFirst;

  const amount = normalizedFirst.amount - normalizedSecond.amount;

  return money({ amount, currency, scale });
};
