import { assert } from "helpers/assert.ts";
import { NON_DECIMAL_CURRENCY_MESSAGE } from "messages";
import { Money } from "mod";
import { Transformer } from "types/types.ts";
import { absolute, computeBase, isArray } from "utils/index.ts";
import { toUnits } from "api/formatting/toUnits.ts";

export type ToDecimalParams<TOutput> = readonly [
  monetaObject: Money,
  transformer?: Transformer<TOutput, string>,
];

/**
 * Get the amount of a Money object in a stringified decimal representation.
 *
 * The number of decimal places depends on the scale of your object—or, when
 * unspecified, the exponent of its currency. Only works with single-based,
 * base-10 currencies.
 *
 * @param monetaObject The Money object to format.
 * @param transformer An optional transformer function.
 * @returns The decimal string, or the transformer's return value.
 *
 * @example Format an object in decimal format
 * ```ts
 * import { money, toDecimal, USD } from "jsr:@quarzo-life/moneta";
 *
 * const d1 = money({ amount: 1050n, currency: USD });
 * const d2 = money({ amount: 10545n, currency: USD, scale: 3 });
 *
 * toDecimal(d1); // "10.50"
 * toDecimal(d2); // "10.545"
 * ```
 *
 * @example Use a custom transformer
 * ```ts
 * import { money, toDecimal, USD } from "jsr:@quarzo-life/moneta";
 *
 * const d = money({ amount: 1050n, currency: USD });
 *
 * toDecimal(d, ({ value, currency }) =>
 *   new Intl.NumberFormat("en-US", { style: "currency", currency: currency.code })
 *     .format(Number(value))
 * ); // "$10.50"
 *
 * toDecimal(d, ({ value, currency }) => `${currency.code} ${value}`); // "USD 10.50"
 * ```
 */
export const toDecimal = <TOutput>(
  ...[monetaObject, transformer]: ToDecimalParams<TOutput>
): TOutput | string => {
  const { currency, scale, formatter } = monetaObject;

  assert(
    !isArray(currency.base) && computeBase(currency.base) % 10 === 0,
    NON_DECIMAL_CURRENCY_MESSAGE,
  );

  const units = toUnits(monetaObject);
  const whole = formatter.toString(units[0]);

  let value: string;
  if (scale > 0) {
    const fractional = formatter.toString(absolute(units[1]));
    const decimal = `${whole}.${fractional.padStart(scale, "0")}`;
    // units[0] === 0n when the amount is between -1 and 0 (e.g. -$0.50).
    // bigint has no -0, so toString(0n) won't preserve the negative sign.
    value = units[0] === 0n && units[1] < 0n ? `-${decimal}` : decimal;
  } else {
    value = whole;
  }

  return transformer ? transformer({ value, currency }) : value;
};
