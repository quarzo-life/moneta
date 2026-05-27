import { UNEQUAL_CURRENCIES_MESSAGE } from "messages";
import { assert, maxBigIntArray } from "helpers/index.ts";
import { type Money, money } from "mod";
import { haveSameCurrency, normalizeScale } from "api/index.ts";

export type MaximumParams = readonly [
  monetaObjects: ReadonlyArray<Money>,
];

/**
 * Get the greatest of the passed Money objects.
 *
 * @param moneyObjects - The Money objects to maximum.
 *
 * @returns A new Money object.
 *
 * @example
 * import { Money, maximum, EUR } from "jsr:@quarzo-life/moneta"
 *
 * const first = money({ amount: 150, currency: USD });
 * const second = money({ amount: 50, currency: USD });
 *
 * maximum([first, second]);
 */
export const maximum = (...[moneyObjects]: MaximumParams): Money => {
  assert(haveSameCurrency(moneyObjects), UNEQUAL_CURRENCIES_MESSAGE);

  const normalizedMoneyObjects = normalizeScale(moneyObjects);

  const [{ currency, scale }] = normalizedMoneyObjects;

  const amount = maxBigIntArray(
    normalizedMoneyObjects.map(({ amount }) => amount),
  );

  return money({
    amount,
    currency,
    scale,
  });
};
