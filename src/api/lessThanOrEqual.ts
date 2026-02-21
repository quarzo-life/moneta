import { UNEQUAL_CURRENCIES_MESSAGE } from "../../messages.ts";
import { assert } from "../helpers/assert.ts";
import { Money } from "../../mod.ts";
import { haveSameCurrency, normalizeScale } from "./index.ts";

/**
 * Check whether the value of a Dinero object is less than or equal to another.
 *
 * You can only compare objects that share the same currency.
 * The function also normalizes objects to the same scale (the highest)
 * before comparing them.
 * @param moneyObject The first Money object to compare.
 * @param comparator The second Money object to compare.
 * @returns true if moneyObject <= comparator
 */
export const lessThanOrEqual = (
  moneyObject: Money,
  comparator: Money,
): boolean => {
  const condition = haveSameCurrency([moneyObject, comparator]);
  assert(condition, UNEQUAL_CURRENCIES_MESSAGE);

  const [subjectAmount, comparatorAmount] = normalizeScale([
    moneyObject,
    comparator,
  ]);
  return subjectAmount <= comparatorAmount;
};
