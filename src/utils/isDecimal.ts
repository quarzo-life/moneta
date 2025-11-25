import { Money } from "../../mod.ts";

/**
 * Is the currency decimal (base 10)?
 * @param m moneta object
 * @returns
 */
export const isDecimal = (m: Money): boolean => {
  const currency = m.currency;
  const base = currency.base;

  return base === 10;
};
