import { computeBase, Money } from "../../mod.ts";

export type HasSubUnitsParams = readonly [
  monetaObject: Money,
];

/**
 * Money object has sub units
 * @param monetaObject moneta object
 * @returns
 */
export const hasSubUnits = (...[monetaObject]: HasSubUnitsParams): boolean => {
  const { amount, currency, scale } = monetaObject;
  const base = computeBase(currency.base);

  return amount % BigInt(base ** scale) !== 0n;
};
