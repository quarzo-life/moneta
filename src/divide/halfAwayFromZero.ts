import { DivideOperation } from "types/types.ts";
import { absolute } from "utils/absolute.ts";
import { isHalf } from "utils/isHalf.ts";
import { sign } from "utils/sign.ts";
import { halfUp, up } from "./index.ts";

/**
 * Divide and round towards the nearest neighbor, rounding away from zero when exactly halfway.
 *
 * This rounding mode rounds to the nearest integer. When the value is exactly halfway between two integers, it rounds away from zero. Positive halfway values round up (e.g., 1.5 becomes 2), and negative halfway values round down (e.g., -1.5 becomes -2).
 *
 * This is sometimes referred to as "commercial rounding" or "arithmetic rounding."
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
export const halfAwayFromZero: DivideOperation = (
  amount,
  factor,
) => {
  if (!isHalf(amount, factor)) {
    return halfUp(amount, factor);
  }

  return sign(amount) * up(absolute(amount), factor);
};
