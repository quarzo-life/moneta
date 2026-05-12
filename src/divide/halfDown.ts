import { DivideOperation } from "types/types.ts";
import { isHalf } from "utils/isHalf.ts";
import { down, halfUp } from "./index.ts";

/**
 * Divide and round towards the nearest neighbor, rounding down when exactly halfway.
 *
 * This rounding mode rounds to the nearest integer. When the value is exactly halfway between two integers (e.g., 1.5), it rounds down (towards negative infinity). For non-halfway values, it behaves the same as `halfUp`.
 *
 * For example, 1.5 rounds to 1, 2.5 rounds to 2, and -1.5 rounds to -2.
 *
 * Rounding down happens when:
 * - The quotient is half (e.g., -1.5, 1.5).
 * - The quotient is positive and less than half (e.g., 1.4).
 * - The quotient is negative and greater than half (e.g., -1.6).
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
export const halfDown: DivideOperation = (amount, factor) => {
  if (isHalf(amount, factor)) {
    return down(amount, factor);
  }

  return halfUp(amount, factor);
};
