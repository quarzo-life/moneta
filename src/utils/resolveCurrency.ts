import { CURRENCIES, type CurrencyCode } from "currencies/index.ts";
import { assert } from "helpers/assert.ts";
import type { Currency } from "types/types.ts";

/**
 * Resolve a Currency object from itself or from a known currency code.
 * @param currency
 * @returns
 */
export const resolveCurrency = (
  currency: Currency | CurrencyCode,
): Currency => {
  if (typeof currency !== "string") {
    return currency;
  }

  const found = CURRENCIES[currency];

  assert(!!found, `Unknown currency code: ${currency}`);

  return found;
};
