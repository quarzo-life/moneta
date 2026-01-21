import { toDecimal } from "../api/toDecimal.ts";
import { CURRENCIES, CurrencyCode } from "../currencies/index.ts";
import type { Currency, Formatter } from "../types/types.ts";
import { toString } from "../utils/toString.ts";

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

  static readonly defaultFormatter: Formatter = Object.freeze({
    toNumber: Number,
    toString: String,
  });

  /** Formatter of the amount */
  readonly formatter: Formatter = Money.defaultFormatter;

  /**
   * Create a Money object with amount 0 for the specified currency.
   * @param currency The currency for the zero amount
   * @returns A new Money object with amount 0n
   * @example
   * const zeroMoney = Money.zero('EUR');
   */
  static zero(currency: Currency | CurrencyCode): Money {
    return new Money({ amount: 0n, currency });
  }

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
  constructor({
    amount = 0n,
    // not optional to force dev to see the currency they manipulate
    currency,
    scale,
  }: {
    amount?: number | bigint | string;
    currency: Currency | CurrencyCode;
    scale?: number;
  }) {
    // 1. Resolve Currency
    if (typeof currency === "string") {
      const foundCurrency = CURRENCIES[currency];
      if (!foundCurrency) {
        throw new Error(`[Money] Unknown currency code: ${currency}`);
      }
      this.currency = foundCurrency;
    } else {
      this.currency = currency;
    }

    // 2. Resolve Scale (Default to currency exponent, fallback to 2)
    const resolvedScale = scale ?? this.currency.exponent ?? 2;
    if (!Number.isInteger(resolvedScale)) {
      throw new Error(
        `[Money] Scale must be an integer, but received: ${resolvedScale} (${typeof resolvedScale})`,
      );
    }

    if (resolvedScale < 0) {
      throw new Error(
        `[Money] Scale must be a non-negative integer, but received: ${resolvedScale}`,
      );
    }
    this.scale = resolvedScale;

    // 3. Resolve Amount
    if (typeof amount === "bigint") {
      this.amount = amount;
    } else if (typeof amount === "number") {
      if (!Number.isSafeInteger(amount)) {
        throw new Error(
          "[Money] Amount is not a safe integer; use bigint or string",
        );
      }
      this.amount = BigInt(amount);
    } else if (typeof amount === "string") {
      // Handles "123", "123n", and whitespace
      const normalized = amount.trim().replace(/n$/, "");
      if (!/^-?\d+$/.test(normalized)) {
        throw new Error(`[Money] Invalid string amount: ${amount}`);
      }
      this.amount = BigInt(normalized);
    } else {
      throw new Error("[Money] Invalid amount type");
    }

    this.formatter = Money.defaultFormatter;
  }

  /** Get the amount of a Money object in a stringified decimal representation. */
  toDecimal(): string {
    return toDecimal(this);
  }

  /** Print Money object as a string with it currency and amount with decimal.  */
  toString(): string {
    return toString(this);
  }

  /**
   * Compares two Money objects for equality.
   */
  equals(other: Money): boolean {
    return (
      this.amount === other.amount &&
      this.currency.code === other.currency.code &&
      this.scale === other.scale
    );
  }

  /** Provide the JSON-serializable representation of a Money object.
   * We choose the approach of adding a "n" suffix to BigInt values when serializing to JSON.
   * Use `JSON.stringify(money)` to create a JSON string (toJSON is implicitly called)
   * Use `new Money(parse(money))` to deserialize a Money object from a JSON string.
   */
  toJSON(): {
    amount: string;
    currency: string;
    scale: number;
  } {
    return {
      amount: `${this.amount}n`,
      currency: this.currency.code,
      scale: this.scale,
    };
  }
}
