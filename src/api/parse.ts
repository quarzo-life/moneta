import { bigIntReviver } from "../helpers/JSONbigint.ts";
import { Money } from "../../mod.ts";
import { Currency } from "../types/types.ts";

/**
 * Reviver a JSON string to a Money object
 * @param text a Money object as a JSON string
 * @returns a Money object
 */
export const parse = (text: string): Money => {
  const json = JSON.parse(text, bigIntReviver);
  const amount = json?.amount || 0n;
  const currency = json.currency as Currency;
  const scale = json?.scale || 0;

  return new Money({ amount, currency, scale });
};
