import { UNEQUAL_CURRENCIES_MESSAGE } from "../../messages.ts";
import { assert, maxBigIntArray } from "../helpers/index.ts";
import { Money } from "../../mod.ts";
import { haveSameCurrency, normalizeScale } from "./index.ts";

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
 * const d1 = new Money({ amount: 150, currency: USD });
 * const d2 = new Money({ amount: 50, currency: USD });
 *
 * maximum([d1, d2]);
 */
export const maximum = (...[moneyObjects]: MaximumParams): Money => {
  const condition = haveSameCurrency(moneyObjects);
  assert(condition, UNEQUAL_CURRENCIES_MESSAGE);

  const normalizedMoneyObjects = normalizeScale(moneyObjects);

  const [firstMoney] = normalizedMoneyObjects;
  const { currency, scale } = firstMoney;

  const amount = maxBigIntArray(
    normalizedMoneyObjects.map((subject) => subject.amount),
  );

  return new Money({
    amount,
    currency,
    scale,
  });
};
