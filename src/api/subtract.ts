import { UNEQUAL_CURRENCIES_MESSAGE } from "../../messages.ts";
import { Money } from "../../mod.ts";
import { assert } from "../helpers/assert.ts";
import { normalizeScale } from "./normalizeScale.ts";
import { haveSameCurrency } from "./index.ts";

/**
 * Subtract two Money objects.
 *
 * You can only subtract objects that share the same currency. The function also normalizes objects to the same scale (the highest) before subtracting them.
 * @param minuend The Money object to subtract from.
 * @param subtrahend The Money object to subtract from.
 * @returns a new Money object
 * @example // Subtract more than two objects
 * import { Money, subtract, USD } from "jsr:@b-life-org/moneta"
 *
 * const d1 = new Money({ amount: 400n, currency: USD });
 * const d2 = new Money({ amount: 200n, currency: USD });
 * const d3 = new Money({ amount: 100n, currency: USD });
 *
 * const subtractMany = (subtrahends: Money[]) => subtrahends.reduce(subtract);
 *
 * subtractMany([d1, d2, d3]); // a Money object with amount 100
 * @example // Subtract objects with a different scale
 * import { Money, subtract, USD } from "jsr:@b-life-org/moneta"
 *
 * const d1 = new Money({ amount: 500n, currency: USD });
 * const d2 = new Money({ amount: 1000n, currency: USD, scale: 3 });
 *
 * subtract(d1, d2); // a Money object with amount 4000 and scale 3
 */
export const subtract = (minuend: Money, subtrahend: Money): Money => {
  assert(haveSameCurrency([minuend, subtrahend]), UNEQUAL_CURRENCIES_MESSAGE);

  const [newMinuend, newSubtrahend] = normalizeScale([minuend, subtrahend]);
  const amount = newMinuend.amount - newSubtrahend.amount;
  const currency = newMinuend.currency;
  const scale = newMinuend.scale;

  return new Money({ amount, currency, scale });
};
