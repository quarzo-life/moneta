import { CURRENCIES, type CurrencyCode } from "../currencies/index.ts";
import type { Currency, Formatter } from "../types/types.ts";

/**
 * Money object representing a monetary value (e.g. 51,20 EUR).
 *
 * Plain immutable data: an integer `amount` in the smallest subdivision of
 * `currency`, plus a `scale` for precision. Build instances with {@link money}
 * or {@link zeroMoney}; never mutate fields directly.
 */
export type Money = Readonly<{
  /** Amount expressed in the smallest subdivision of the currency, as an integer */
  amount: bigint;
  /** The currency of the money with a base (decimal or rarely non decimal) and exponent */
  currency: Currency;
  /** Conceptually close to the currency exponent but expresses precision as accurately as possible */
  scale: number;
  /** Formatter of the amount */
  formatter: Formatter;
  /**
   * JSON-serializable representation of the Money object.
   * Called implicitly by `JSON.stringify(money)`.
   * Use `money(parse(jsonString))` to deserialize.
   */
  toJSON: () => { amount: string; currency: string; scale: number };
}>;

/** Default formatter used when none is supplied. */
export const defaultFormatter: Formatter = Object.freeze({
  toNumber: Number,
  toString: String,
});

/** Options accepted by the {@link money} factory. */
export type MoneyOptions = {
  amount?: number | bigint | string;
  /** Not optional, to force the developer to see the currency they manipulate. */
  currency: Currency | CurrencyCode;
  scale?: number;
};

/**
 * Create a new Money object.
 *
 * @param amount The amount expressed in the smallest subdivision of the
 * currency, as an integer. For example, 50 EUR equals 5,000 cents EUR.
 * Default `0n`.
 * @param currency Either a {@link Currency} object or a known {@link CurrencyCode}.
 * A Currency is composed of a unique code (e.g. `EUR`), a base/radix (e.g. `10`),
 * and an exponent (e.g. `2`).
 * @param scale Precision of the amount. Defaults to the currency exponent.
 *
 * @example
 * import { money, EUR } from "jsr:@quarzo-life/moneta";
 *
 * const m = money({ amount: 500n, currency: EUR }); // 5,00 EUR
 */
export const money = ({
  amount = 0n,
  currency,
  scale,
}: MoneyOptions): Money => {
  // 1. Resolve Currency
  let resolvedCurrency: Currency;
  if (typeof currency === "string") {
    const found = CURRENCIES[currency];
    if (!found) {
      throw new Error(`[Money] Unknown currency code: ${currency}`);
    }
    resolvedCurrency = found;
  } else {
    resolvedCurrency = currency;
  }

  // 2. Resolve Scale (default to currency exponent, fallback to 2)
  const resolvedScale = scale ?? resolvedCurrency.exponent ?? 2;
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

  // 3. Resolve Amount
  let resolvedAmount: bigint;
  if (typeof amount === "bigint") {
    resolvedAmount = amount;
  } else if (typeof amount === "number") {
    if (!Number.isSafeInteger(amount)) {
      throw new Error(
        "[Money] Amount is not a safe integer; use bigint or string",
      );
    }
    resolvedAmount = BigInt(amount);
  } else if (typeof amount === "string") {
    // Handles "123", "123n", and whitespace
    const normalized = amount.trim().replace(/n$/, "");
    if (!/^-?\d+$/.test(normalized)) {
      throw new Error(`[Money] Invalid string amount: ${amount}`);
    }
    resolvedAmount = BigInt(normalized);
  } else {
    throw new Error("[Money] Invalid amount type");
  }

  return Object.freeze({
    amount: resolvedAmount,
    currency: resolvedCurrency,
    scale: resolvedScale,
    formatter: defaultFormatter,
    toJSON() {
      return {
        amount: `${resolvedAmount}n`,
        currency: resolvedCurrency.code,
        scale: resolvedScale,
      };
    },
  });
};

/**
 * Create a Money object with amount `0n` for the specified currency.
 *
 * @example
 * const zero = zeroMoney("EUR");
 */
export const zeroMoney = (currency: Currency | CurrencyCode): Money =>
  money({ amount: 0n, currency });
