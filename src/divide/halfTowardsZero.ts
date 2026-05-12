import { DivideOperation } from "types/types.ts";
import { absolute } from "utils/absolute.ts";
import { isHalf } from "utils/isHalf.ts";
import { sign } from "utils/sign.ts";
import { down, halfUp } from "./index.ts";

/**
 * Divide and round towards the nearest neighbor, rounding towards zero when exactly halfway.
 *
 * This rounding mode rounds to the nearest integer. When the value is exactly halfway between two integers, it rounds towards zero. Positive halfway values round down (e.g., 1.5 becomes 1), and negative halfway values round up (e.g., -1.5 becomes -1).
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
export const halfTowardsZero: DivideOperation = (
  amount,
  factor,
) => {
  if (!isHalf(amount, factor)) {
    return halfUp(amount, factor);
  }

  return sign(amount) * down(absolute(amount), factor);
};
