import {
  INCOMPATIBLE_BASES_MESSAGE,
  INVALID_RATE_MESSAGE,
  UNEQUAL_CURRENCIES_MESSAGE,
} from "../../messages.ts";
import { Money } from "../../mod.ts";
import type { Currency, FXRate } from "../types/types.ts";
import { assert } from "../helpers/assert.ts";
import { getAmountAndScale, isArray } from "../utils/index.ts";
import { halfUp } from "../divide/halfUp.ts";
import { transformScale } from "./transformScale.ts";

const areBasesCompatible = (
  left: number | readonly number[],
  right: number | readonly number[],
): boolean => {
  const leftIsArray = isArray(left);
  const rightIsArray = isArray(right);

  if (leftIsArray !== rightIsArray) {
    return false;
  }

  if (leftIsArray && rightIsArray) {
    if (left.length !== right.length) {
      return false;
    }
    return left.every((value, index) => value === right[index]);
  }

  return left === right;
};

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
 * For example, instead of passing 0.89, you should pass { amount: 89, scale: 2 }.
 * When using scaled amounts, the function converts the returned object to the safest scale.
 *
 * @param moneyObject Money object to convert.
 * @param fx.from Source currency for the rate.
 * @param fx.to Target currency for the rate.
 * @param fx.rate Exchange rate as a scaled amount or integer.
 * @returns Money object in the target currency.
 */
export const convert = (moneyObject: Money, fx: FXRate): Money => {
  const { from, to, rate } = fx;

  assert(
    isSameCurrency(moneyObject.currency, from),
    UNEQUAL_CURRENCIES_MESSAGE,
  );

  assert(
    areBasesCompatible(from.base, to.base),
    INCOMPATIBLE_BASES_MESSAGE,
  );

  if (typeof rate === "number" && !Number.isInteger(rate)) {
    assert(false, INVALID_RATE_MESSAGE);
  }

  const { amount: rateAmount, scale: rateScale } = getAmountAndScale(rate);

  const newScale = moneyObject.scale + rateScale;
  const result = new Money({
    amount: moneyObject.amount * rateAmount,
    currency: to,
    scale: newScale,
  });

  // by default, round to halfUp
  return transformScale(result, to.exponent, halfUp);
};
