import { Money } from "../../mod.ts";
import { isDecimal } from "./isDecimal.ts";

/**
 * Print a Money object as a string with it currency and amount with decimal.
 * @param m Money object to print.
 * @returns
 */
export const toString = (m: Money): string => {
  const currency = m.currency;

  if (isDecimal(m)) {
    return `${currency.code} ${m.toDecimal()}`;
  } else {
    return `${currency.code} ${m.amount.toString()}`;
  }
};
