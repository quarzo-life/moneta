import { UNEQUAL_CURRENCIES_MESSAGE } from "../../messages.ts";
import { Money } from "../../mod.ts";
import { assert } from "../helpers/assert.ts";
import { normalizeScale } from "./normalizeScale.ts";
import { haveSameCurrency } from "./index.ts";

/**
 * Add two Money object
 * @param m1 Money object
 * @param extras Money object, one or more object
 * @returns monata object
 * @example // To add many Money object
 * import { Money, add, USD } from "jsr:@quarzo-life/moneta"
 *
 * const d1 = new Money({ amount: 300n, currency: USD });
 * const d2 = new Money({ amount: 200n, currency: USD });
 * const d3 = new Money({ amount: 100n, currency: USD });
 *
 * const addMany = (addends: Money[]) => addends.reduce(add);
 *
 * addMany([d1, d2, d3]); // a Money object with amount 600
 */
export const add = (augend: Money, addend: Money): Money => {
  const condition = haveSameCurrency([augend, addend]);
  assert(condition, UNEQUAL_CURRENCIES_MESSAGE);

  const [newAugend, newAddend] = normalizeScale([augend, addend]);
  const amount = newAugend.amount + newAddend.amount;
  const currency = newAugend.currency;
  const scale = newAugend.scale;

  return new Money({ amount, currency, scale });
};
