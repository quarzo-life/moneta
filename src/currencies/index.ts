/**
 * Exports all the currency classes.
 * @module Currencies
 */

import type { Currency } from "../types/types.ts";
import { CHF } from "./chf.ts";
import { EUR } from "./eur.ts";
import { GBP } from "./gbp.ts";
import { JPY } from "./jpy.ts";
import { MGA } from "./mga.ts";
import { MKD } from "./mkd.ts";
import { USD } from "./usd.ts";

/** All currencies known to moneta, keyed by their {@link CurrencyCode}. */
export const CURRENCIES: {
  readonly CHF: Currency;
  readonly EUR: Currency;
  readonly GBP: Currency;
  readonly JPY: Currency;
  readonly MGA: Currency;
  readonly MKD: Currency;
  readonly USD: Currency;
} = { CHF, EUR, GBP, JPY, MGA, MKD, USD };

/** Union of the currency codes known to moneta (keys of {@link CURRENCIES}). */
export type CurrencyCode = keyof typeof CURRENCIES;

export { CHF, EUR, GBP, JPY, MGA, MKD, USD };
