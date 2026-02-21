import { UNEQUAL_CURRENCIES_MESSAGE } from "../../messages.ts";
import { assert, minBigIntArray } from "../helpers/index.ts";
import { Money } from "../../mod.ts";
import { haveSameCurrency, normalizeScale } from "./index.ts";

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
 * const d1 = new Money({ amount: 150, currency: USD });
 * const d2 = new Money({ amount: 50, currency: USD });
 *
 * minimum([d1, d2]);
 */
export const minimum = (...[moneyObjects]: MinimumParams): Money => {
  const condition = haveSameCurrency(moneyObjects);
  assert(condition, UNEQUAL_CURRENCIES_MESSAGE);

  const normalizedMoneyObjects = normalizeScale(moneyObjects);

  const [firstMoney] = normalizedMoneyObjects;
  const { currency, scale } = firstMoney;

  const amount = minBigIntArray(
    normalizedMoneyObjects.map((subject) => subject.amount),
  );

  return new Money({
    amount,
    currency,
    scale,
  });
};
