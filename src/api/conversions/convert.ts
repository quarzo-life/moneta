import {
  INCOMPATIBLE_BASES_MESSAGE,
  UNEQUAL_CURRENCIES_MESSAGE,
} from "messages";
import { type Money, money } from "money/index.ts";
import type { Currency, DivideOperation, FXRate } from "types/types.ts";
import { assert } from "helpers/assert.ts";
import { areBasesCompatible } from "utils/areBasesCompatible.ts";
import { resolveRate } from "utils/resolveRate.ts";
import { halfUp } from "divide/halfUp.ts";
import { dangerTransformScale } from "api/conversions/dangerTransformScale.ts";

const isSameCurrency = (left: Currency, right: Currency): boolean => {
  return (
    left.code === right.code &&
    left.exponent === right.exponent &&
    areBasesCompatible(left.base, right.base)
  );
};

/**
 * Convert a Money object to another currency using a market rate.
 *
 * The rate must represent the target currency value for 1 unit of the source currency.
 * For example: EUR -> JPY, rate { amount: 1826818n, scale: 4 }.
 *
 * If you need to use fractional rates, you shouldn't use floats, but scaled amounts instead.
 * For example, instead of passing 0.89, you should pass { amount: 89n, scale: 2 }.
 *
 * The result is rounded to the target currency exponent with `divide`, which
 * defaults to `halfUp`. Pass another rounding strategy (e.g. `halfEven`) when
 * your conversion rules require it. `fx.context` is ignored.
 *
 * @param moneyObject Money object to convert.
 * @param fx.from Source currency for the rate.
 * @param fx.to Target currency for the rate.
 * @param fx.rate Exchange rate as a strictly positive scaled amount or integer.
 * @param divide Rounding applied to reach the target exponent. Default `halfUp`.
 * @returns Money object in the target currency.
 *
 * @example
 * import { convert, fxRate, halfEven, money } from "jsr:@quarzo-life/moneta";
 *
 * const fx = fxRate({ from: "EUR", to: "JPY", rate: { amount: 1826818n, scale: 4 } });
 * const m = money({ amount: 1000n, currency: "EUR" }); // 10,00 EUR
 *
 * convert(m, fx); // 1827 JPY (halfUp)
 * convert(m, fx, halfEven); // 1827 JPY
 */
export const convert = (
  moneyObject: Money,
  fx: FXRate,
  divide: DivideOperation = halfUp,
): Money => {
  const { from, to, rate } = fx;

  assert(
    isSameCurrency(moneyObject.currency, from),
    UNEQUAL_CURRENCIES_MESSAGE,
  );

  assert(
    areBasesCompatible(from.base, to.base),
    INCOMPATIBLE_BASES_MESSAGE,
  );

  const { amount: rateAmount, scale: rateScale } = resolveRate(rate);

  const result = money({
    amount: moneyObject.amount * rateAmount,
    currency: to,
    scale: moneyObject.scale + rateScale,
  });

  return dangerTransformScale(result, to.exponent, divide);
};
