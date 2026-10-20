import { DivideOperation } from "types/types.ts";

/**
 * Divide and round towards positive infinity.
 *
 * This rounding mode always rounds up, regardless of the fractional part. For positive numbers, any fractional value causes the result to increase (e.g., 1.1 becomes 2, 1.9 becomes 2). For negative numbers, it rounds towards zero (e.g., -1.9 becomes -1).
 *
 * **Usage** : Pass this function as the rounding argument to `dangerTransformScale`, `dangerRound`, or `dangerDivide` to control how remainders are handled.
 *
 * @see dangerTransformScale
 * @see dangerRound
 * @see dangerDivide
 *
 * @param amount - The amount to divide.
 * @param factor - The factor to divide by.
 * @param calculator - The calculator to use.
 *
 * @returns The rounded amount.
 */
export const up: DivideOperation = (amount, factor): bigint => {
  const zero = 0n;

  const isPositive = amount > zero;

  const quotient = amount / BigInt(factor);

  const remainder = amount % BigInt(factor);

  const isInteger = remainder === zero;

  if (!isInteger && isPositive) {
    return quotient + 1n;
  }

  return quotient;
};
