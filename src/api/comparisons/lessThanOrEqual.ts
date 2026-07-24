import type { Money } from "money/index.ts";
import { compareAmounts } from "api/comparisons/compareAmounts.ts";

/**
 * Check whether the value of a Money object is less than or equal to another.
 *
 * You can only compare objects that share the same currency.
 * The function also normalizes objects to the same scale (the highest)
 * before comparing them.
 * @param first The first Money object to compare.
 * @param second The second Money object to compare.
 * @returns true if moneyObject <= comparator
 */
export const lessThanOrEqual = (first: Money, second: Money): boolean =>
  compareAmounts(first, second, (a, b) => a <= b);
