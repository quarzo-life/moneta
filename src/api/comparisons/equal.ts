import type { Money } from "money/index.ts";
import { haveSameAmount, haveSameCurrency } from "api/index.ts";

/**
 * Are Money objects equal ?
 * @param first a Money object
 * @param second a Money object
 * @returns true if equal
 */
export const equal = (first: Money, second: Money): boolean => {
  return haveSameCurrency([first, second]) && haveSameAmount([first, second]);
};
