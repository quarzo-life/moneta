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
 * Divide Operation function
 *
 * Use for transformScale when reduce the scale
 */
export type DivideOperation = (
  amount: bigint,
  factor: number,
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
export type Rate = ScaledAmount | number;

/**
 * Rates is a Record of Rate
 */
export type Rates = Record<string, Rate>;

/**
 * Formatter for Money
 */
export type Formatter = {
  readonly toNumber: (value?: bigint) => number;
  readonly toString: (value?: bigint) => string;
};

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
