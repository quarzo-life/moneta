import { computeBase, Money } from "mod";

/**
 * Money object has sub units
 * @param monetaObject moneta object
 * @returns
 */
export const hasSubUnits = (monetaObject: Money): boolean => {
  const { amount, currency, scale } = monetaObject;
  const base = computeBase(currency.base);
  return amount % BigInt(base ** scale) !== 0n;
};
