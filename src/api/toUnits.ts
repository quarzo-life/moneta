import { Money } from "../../mod.ts";
import { getDivisors, isArray } from "../utils/index.ts";
import { Transformer } from "../types/types.ts";

export type ToUnitsParams<TOutput> = readonly [
  monetaObject: Money,
  transformer?: Transformer<TOutput, readonly bigint[]>,
];

/**
 * Get the amount of a new Money object in units.
 * This function returns the total amount divided into each unit and sub-unit, as an array. For example, an object representing $10.45 expressed as 1045 (with currency USD and no custom scale) would return [10, 45] for 10 dollars and 45 cents.
 *
 * When specifying multiple bases, the function returns as many units as necessary.
 *
 * @param monetaObject The Money object to format.
 * @param transformer An optional transformer function.
 * @returns
 * @example // Format an object in units

 * import { Money, toUnits, USD } from "jsr:@b-life-org/moneta"

const d1 = new Money({ amount: 1050, currency: USD });
const d2 = new Money({ amount: 10545, currency: USD, scale: 3 });

toUnits(d1); // [10, 50]
toUnits(d2); // [10, 545]

* @example // Format a non-decimal object

 * import { Money, toUnits } from "jsr:@b-life-org/moneta"

const GRD = { code: 'GRD', base: 6, exponent: 1 };
const d = new Money({ amount: 9, currency: GRD });

toUnits(d); // [1, 3]

* @example // Format an object with multiple subdivisions

 * import { Money, toUnits } from "jsr:@b-life-org/moneta"

const GBP = { code: 'GBP', base: [20, 12], exponent: 1 };
const d = new Money({ amount: 267n, currency: GBP });

toUnits(d); // [1, 2, 3]

* @example // Use a custom transformer

// If you need to further transform the value before returning it, you can pass a custom function.

 * import { Money, toUnits } from "jsr:@b-life-org/moneta"

const GBP = { code: 'GBP', base: [20, 12], exponent: 1 };
const d = new Money({ amount: 267n, currency: GBP });

const labels = ['pounds', 'shillings', 'pence'];

toUnits(d, ({ value }) =>
  value
    .filter((amount) => amount > 0)
    .map((amount, index) => `${amount} ${labels[index]}`)
    .join(', ')
);

 */
export const toUnits = (
  ...[monetaObject, transformer]: ToUnitsParams<bigint[]>
): readonly bigint[] => {
  const { amount, currency, scale } = monetaObject;

  const bases = isArray(currency.base) ? currency.base : [currency.base];
  const divisors = getDivisors(bases.map((base) => base ** scale));
  const value = divisors.reduce<readonly bigint[]>(
    (amounts, divisor, index) => {
      const amountLeft = amounts[index];

      const quotient = amountLeft / BigInt(divisor);
      const remainder = amountLeft % BigInt(divisor);

      return [...amounts.filter((_, i) => i !== index), quotient, remainder];
    },
    [amount],
  );

  if (!transformer) {
    return value;
  }

  return transformer({ value, currency });
};
