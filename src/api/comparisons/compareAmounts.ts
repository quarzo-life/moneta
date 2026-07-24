import { UNEQUAL_CURRENCIES_MESSAGE } from "messages";
import { assert } from "helpers/assert.ts";
import type { Money } from "money/index.ts";
import { normalizeScale } from "api/conversions/normalizeScale.ts";
import { haveSameCurrency } from "api/comparisons/haveSameCurrency.ts";

export const compareAmounts = (
  first: Money,
  second: Money,
  predicate: (a: bigint, b: bigint) => boolean,
): boolean => {
  assert(haveSameCurrency([first, second]), UNEQUAL_CURRENCIES_MESSAGE);
  const [normalizedFirst, normalizedSecond] = normalizeScale([first, second]);
  return predicate(normalizedFirst.amount, normalizedSecond.amount);
};
