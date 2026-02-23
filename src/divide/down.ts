import { DivideOperation } from "../types/types.ts";

/**
 * Divide and round down.
 *
 * Rounding down happens whenever the quotient is not an integer.
 *
 * @param amount - The amount to divide.
 * @param factor - The factor to divide by.
 *
 * @returns The rounded amount.
 */
export const down: DivideOperation = (
  amount,
  factor,
) => {
  const quotient = amount / factor;
  const remainder = amount % factor;
  const isInteger = remainder === 0n;
  const isPositive = amount > 0n;
  if (isPositive || isInteger) {
    return quotient;
  }
  return quotient - 1n;
};
