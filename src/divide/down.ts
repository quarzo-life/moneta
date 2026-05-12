import { DivideOperation } from "types/types.ts";

/**
 *  Divide and round towards negative infinity.
 *
 * This rounding mode always rounds down, regardless of the fractional part. For positive numbers, it truncates the decimal (e.g., 1.1 becomes 1, 1.9 becomes 1). For negative numbers, it rounds away from zero (e.g., -1.1 becomes -2).
 *
 * This is the default rounding mode used by `transformScale`
 *
 * **Usage** : Pass this function as the last argument to `multiply`, `allocate`, or `transformScale` to control how remainders are handled.
 *
 * @see multiply
 * @see allocate
 * @see transformScale
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
