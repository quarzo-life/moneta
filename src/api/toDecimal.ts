import { assert } from "../helpers/assert.ts";
import { NON_DECIMAL_CURRENCY_MESSAGE } from "../../messages.ts";
import { Money } from "../../mod.ts";
import { Formatter, Transformer } from "../types/types.ts";
import { absolute, computeBase, isArray } from "../utils/index.ts";
import { toUnits } from "./toUnits.ts";

export type ToDecimalParams<TOutput> = readonly [
  monetaObject: Money,
  transformer?: Transformer<TOutput, string>,
];

/**
 * Get the amount of a Money object in a stringified decimal representation.
 *
 * The number of decimal places depends on the scale of your object—or, when unspecified, the exponent of its currency.
 *
 * You can only use this function with Money objects that are single-based and use a decimal currency.
 *
 * @param monetaObject The Money object to format.
 * @param transformer An optional transformer function.
 * @returns Money object stringified decimal representation
 * @example // Format an object in decimal format
 * import { Money, toDecimal, USD } from "jsr:@quarzo-life/moneta"
 *
 * const d1 = new Money({ amount: 1050n, currency: USD });
 * const d2 = new Money({ amount: 10545n, currency: USD, scale: 3 });
 *
 * toDecimal(d1); // "10.50"
 * toDecimal(d2); // "10.545"
 * @example // Use a custom transformer
 * // If you need to further transform the value before returning it, you can pass a custom function.
 * import { Money, toDecimal, USD } from "jsr:@quarzo-life/moneta"
 *
 * const d = new Money({ amount: 1050n, currency: USD });
 *
 * toDecimal(d, ({ value, currency }) => `${currency.code} ${value}`); // "USD 10.50"
 */
export const toDecimal = (
  ...[monetaObject, transformer]: ToDecimalParams<string>
): string => {
  const { currency, scale } = monetaObject;

  const base = computeBase(currency.base);

  const isMultiBase = isArray(currency.base);
  const isBaseTen = base % 10 === 0;
  const isDecimal = !isMultiBase && isBaseTen;

  assert(isDecimal, NON_DECIMAL_CURRENCY_MESSAGE);

  const units = toUnits(monetaObject);

  const getDecimalFn = getDecimal(monetaObject.formatter);

  const value = getDecimalFn(units, scale);

  if (!transformer) {
    return value;
  }

  return transformer({ value, currency });
};

function getDecimal(formatter: Formatter) {
  return (units: readonly bigint[], scale: number) => {
    const whole = formatter.toString(units[0]);
    const fractional = formatter.toString(absolute(units[1]));

    const decimal = `${whole}.${fractional.padStart(scale, "0")}`;

    const leadsWithZero = units[0] === 0n;
    const isNegative = units[1] < 0n;

    // A leading negative zero is a special case because the `toString`
    // formatter won't preserve its negative sign (since 0 === -0).
    return leadsWithZero && isNegative ? `-${decimal}` : decimal;
  };
}
