/**
 * Exports all the currency classes.
 * @module Currencies
 */

import { EUR } from "./eur.ts";
import { USD } from "./usd.ts";
import { GBP } from "./gbp.ts";
import { CHF } from "./chf.ts";
import { JPY } from "./jpy.ts";
import { MGA } from "./mga.ts";

export const CURRENCIES = {
  EUR,
  USD,
  CHF,
  GBP,
  JPY,
  MGA,
};

export { EUR } from "./eur.ts";
export { CHF } from "./chf.ts";
export { USD } from "./usd.ts";
export { GBP } from "./gbp.ts";
export { JPY } from "./jpy.ts";
export { MGA } from "./mga.ts";

export type CurrencyCode = keyof typeof CURRENCIES;
