import { DivideOperation } from "types/types.ts";
import { isEven, isHalf } from "utils/index.ts";
import { halfUp } from "./index.ts";

/**
 * Divide and round towards the nearest neighbor, rounding to the nearest even integer when exactly halfway.
 *
 * This rounding mode is also known as bankers rounding. It rounds to the nearest integer, and when the value is exactly halfway between two integers, it picks the even one. This reduces cumulative rounding bias in financial calculations.
 *
 * For example, 1.5 rounds to 2, 2.5 rounds to 2, 3.5 rounds to 4, and -2.5 rounds to -2.
 *
 * _Bankers Rounding_
 *
 * Bankers Rounding is an algorithm for rounding quantities to integers, in which numbers which are equidistant from the two nearest integers are rounded to the nearest even integer. Thus, 0.5 rounds down to 0; 1.5 rounds up to 2. A similar algorithm can be constructed for rounding to other sets besides the integers (in particular, sets which a constant interval between adjacent members).
 *
 * Other decimal fractions round as you would expect 0.4 to 0, 0.6 to 1, 1.4 to 1, 1.6 to 2, etc. Only x.5 numbers get the "special" treatment.
 *
 * So called because banks supposedly use it for certain computations.
 *
 * The supposed advantage to bankers rounding is that it is unbiased, and thus produces better results with various operations that involve rounding.
 *
 * It should be noted that it is unbiased only in the limit. That is, an average of all errors approaches 0.0.
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
 * @link BankersRounding https://wiki.c2.com/?BankersRounding
 *
 * @returns The rounded amount.
 */
export const halfEven: DivideOperation = (amount, factor) => {
  const rounded = halfUp(amount, factor);

  if (!isHalf(amount, factor)) {
    return rounded;
  }

  return isEven(rounded) ? rounded : rounded - 1n;
};
