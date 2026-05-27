/**
 * Exports all the currency classes.
 * @module Currencies
 */

import { CHF } from "./chf.ts";
import { EUR } from "./eur.ts";
import { GBP } from "./gbp.ts";
import { JPY } from "./jpy.ts";
import { MGA } from "./mga.ts";
import { MKD } from "./mkd.ts";
import { USD } from "./usd.ts";

export const CURRENCIES = { CHF, EUR, GBP, JPY, MGA, MKD, USD };

export type CurrencyCode = keyof typeof CURRENCIES;

export { CHF, EUR, GBP, JPY, MGA, MKD, USD };
