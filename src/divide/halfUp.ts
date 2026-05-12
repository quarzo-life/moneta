import { DivideOperation } from "types/types.ts";
import { absolute } from "utils/absolute.ts";
import { isHalf } from "utils/isHalf.ts";
import { down, up } from "./index.ts";

/**
 * Divide and round towards the nearest neighbor, rounding up when exactly halfway.
 *
 * This rounding mode rounds to the nearest integer. When the value is exactly halfway between two integers (e.g., 1.5), it rounds up (towards positive infinity). This is the most commonly taught rounding method.
 *
 * For example, 1.5 rounds to 2, 2.5 rounds to 3, and -1.5 rounds to -1.
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
export const halfUp: DivideOperation = (amount, factor) => {
  const zero = 0n;
  const factorBigInt = BigInt(factor);
  const remainder = absolute(amount % factorBigInt);
  const difference = factorBigInt - remainder;
  const isLessThanHalf = difference > remainder;
  const isPositive = amount > zero;

  if (
    isHalf(amount, factor) ||
    (isPositive && !isLessThanHalf) ||
    (!isPositive && isLessThanHalf)
  ) {
    return up(amount, factor);
  }

  return down(amount, factor);
};
