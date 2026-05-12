import { DivideOperation } from "types/types.ts";
import { isEven, isHalf } from "utils/index.ts";
import { halfUp } from "./index.ts";

/**
 * Divide and round towards the nearest neighbor, rounding to the nearest odd integer when exactly halfway.
 *
 * This rounding mode rounds to the nearest integer. When the value is exactly halfway between two integers, it picks the odd one. For non-halfway values, it behaves the same as `halfUp`.
 *
 * For example, 1.5 rounds to 1, 2.5 rounds to 3, 3.5 rounds to 3, and -2.5 rounds to -3.
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
export const halfOdd: DivideOperation = (amount, factor) => {
  const rounded = halfUp(amount, factor);

  if (!isHalf(amount, factor)) {
    return rounded;
  }

  return isEven(rounded) ? rounded - 1n : rounded;
};
