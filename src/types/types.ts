/**
 * Provide all the types used in the library.
 * @module
 */

/**
 * Currency type
 */
export type Currency = {
  /**
   * The unique code of the currency.
   */
  readonly code: string;
  /**
   * The base, or radix of the currency.
   * radix is rare see for example Pre-decimal Great Britain pound sterling
   * EUR : base : 10
   * Malagasy ariary MGA : base : 5
   * Pre-decimal Great Britain pound sterling : base: [20, 12]
   */
  readonly base: number | readonly number[];
  /**
   * The exponent of the currency.
   * exponent : 2 for 10,00 EUR
   */
  readonly exponent: number;
};

/**
 * Divide Operation function: divides `amount` by `factor` and rounds the
 * result to an integer.
 *
 * Passed to `dangerTransformScale`, `dangerRound` and `dangerDivide`, which
 * always call it with a strictly positive `factor` (the sign is carried by
 * `amount`).
 */
export type DivideOperation = (
  amount: bigint,
  factor: bigint,
) => bigint;

/**
 * Scale Amount
 */
export type ScaledAmount = {
  /** Amount */
  readonly amount: bigint;
  /** Scale */
  readonly scale?: number;
};

/**
 * Rate is a ScaledAmount or a number
 */
export type Rate = ScaledAmount | number | bigint;

/**
 * Rates is a Record of Rate
 */
export type Rates = Record<string, Rate>;

/**
 * Nature of an FX rate. The known values get autocompletion; any other string
 * is accepted so callers can use their own taxonomy.
 *
 * - `reference`: published fixing (e.g. ECB reference rate), for valuation.
 * - `indicative`: informative quote, not guaranteed for execution.
 * - `executable`: firm quote a counterparty commits to execute.
 */
export type RateKind =
  | "reference"
  | "indicative"
  | "executable"
  | (string & Record<never, never>);

/**
 * Optional metadata describing where an FX rate comes from and when it can be
 * used. It is never read by `convert`: it only serves traceability.
 *
 * Dates are ISO 8601 strings, either a calendar date (`2026-10-21`, e.g. a
 * daily reference rate) or a date-time with an offset
 * (`2026-10-21T14:03:12Z`, e.g. a broker quote).
 */
export type FXRateContext = Readonly<{
  /** Identifier of the quote at its source, to find it back later. */
  id?: string;
  /** Provider of the rate (e.g. `"ECB"`, a broker name). */
  source?: string;
  /** Nature of the rate. */
  kind?: RateKind;
  /** When the rate was quoted (ISO 8601). */
  quotedAt?: string;
  /** Start of the validity window, inclusive (ISO 8601). */
  validFrom?: string;
  /** End of the validity window, exclusive (ISO 8601). */
  validUntil?: string;
  /** Rates this one was derived from, e.g. EUR→USD and USD→JPY for a EUR→JPY cross rate. */
  derivedFrom?: readonly FXRate[];
}>;

/**
 * FX Rate: 1 unit of `from` equals `rate` units of `to`.
 *
 * Build it with `fxRate()` to get a validated, frozen object; a plain literal
 * is also accepted by `convert`.
 */
export type FXRate = Readonly<{
  /** Source currency. */
  from: Currency;
  /** Target currency. */
  to: Currency;
  /** Units of `to` for 1 unit of `from`; must be strictly positive. */
  rate: Rate;
  /** Optional metadata (source, dates, validity…), ignored by computations. */
  context?: FXRateContext;
}>;

/**
 * TransformerOptions
 */
export type TransformerOptions<TValue> = {
  readonly value: TValue;
  readonly currency: Currency;
};

/**
 * Transformer
 */
export type Transformer<TOutput, TValue> = (
  options: TransformerOptions<TValue>,
) => TOutput;
