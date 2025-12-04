import { EUR } from "../currencies/eur.ts";
import type { Currency, Formatter } from "../types/types.ts";
import { toDecimal } from "../api/toDecimal.ts";
import { toString } from "../utils/toString.ts";
import { toSnapshot } from "../api/index.ts";
import { bigIntReplacer } from "../helpers/JSONbigint.ts";

/**
 * Money class to represent a money (ex 51,20 EUR).
 */
export class Money {
  /** Amount expressed in the smallest subdivision of the currency, as an integer */
  readonly amount: bigint;

  /** The currency of the money with a base (decimal or rarely non decimal) and exponent */
  readonly currency: Currency;

  /** The scale is conceptually close to the currency exponent but serves the purpose of expressing precision as accurately as possible */
  readonly scale: number;

  /** Formatter of the amount */
  readonly formatter: Formatter;

  /**
   * Create a new Money object.
   * @param amount The amount is one of the three pieces of domain data necessary to create a Money object. It's expressed in the smallest subdivision of the currency, as an integer.
   *
   * For example, 50 EUR equal to 5.000 cents EUR.
   *
   * Default value 0n
   * @param currency The currency is one of the three pieces of domain data necessary to create a Money object.
   *
   * A Money currency is composed of:
   * - A unique code. ex EUR
   * - A base, or radix. ex 10
   * - An exponent. ex 2
   *
   * @param scale The scale is one of the three pieces of domain data necessary to create a Money object. It's conceptually close to the currency exponent but serves the purpose of expressing precision as accurately as possible.
   *
   * Most of the time, you don't need to specify the scale. It defaults to the currency exponent.
   *
   * Default currency exponent
   */
  constructor(
    { amount = 0n, currency = EUR, scale = currency.exponent }: {
      amount?: bigint;
      currency: Currency;
      scale?: number;
    },
  ) {
    this.amount = amount;
    this.currency = currency;
    this.scale = scale;
    this.formatter = {
      toNumber: Number,
      toString: String,
    };
  }

  /** Get the amount of a Money object in a stringified decimal representation. */
  toDecimal(): string {
    return toDecimal(this);
  }

  /** Print Money object as a string with it currency and amount with decimal.  */
  toString(): string {
    return toString(this);
  }

  /** Serialize Money object to a JSON string.
   * Use `parse()` to deserialize a Money object from a JSON string.
   */
  toJSON(): string {
    return JSON.stringify(toSnapshot(this), bigIntReplacer);
  }
}
