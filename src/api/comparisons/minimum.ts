import { UNEQUAL_CURRENCIES_MESSAGE } from "messages";
import { assert, minBigIntArray } from "helpers/index.ts";
import { type Money, money } from "mod";
import { haveSameCurrency, normalizeScale } from "api/index.ts";

export type MinimumParams = readonly [
  monetaObjects: ReadonlyArray<Money>,
];

/**
 * Get the lowest of the passed Money objects.
 *
 * @param moneyObjects - The Money objects to maximum.
 *
 * @returns A new Money object with the minimum amount.
 * @example
 * import { Money, minimum, EUR } from "jsr:@quarzo-life/moneta"
 * const first = money({ amount: 150, currency: USD });
 * const second = money({ amount: 50, currency: USD });
 *
 * minimum([first, second]);
 */
export const minimum = (...[moneyObjects]: MinimumParams): Money => {
  assert(haveSameCurrency(moneyObjects), UNEQUAL_CURRENCIES_MESSAGE);

  const normalizedMoneyObjects = normalizeScale(moneyObjects);

  const [{ currency, scale }] = normalizedMoneyObjects;

  const amount = minBigIntArray(
    normalizedMoneyObjects.map(({ amount }) => amount),
  );

  return money({
    amount,
    currency,
    scale,
  });
};
