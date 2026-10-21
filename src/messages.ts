/**
 * Messages for errors.
 * @module messages
 */

export const INVALID_AMOUNT_MESSAGE = "Amount is invalid.";
export const INVALID_SCALE_MESSAGE = "Scale is invalid.";
export const INVALID_RATIOS_MESSAGE = "Ratios are invalid.";
export const UNEQUAL_SCALES_MESSAGE = "Objects must have the same scale.";
export const UNEQUAL_CURRENCIES_MESSAGE =
  "Objects must have the same currency.";
export const NON_DECIMAL_CURRENCY_MESSAGE = "Currency is not decimal.";
export const INCOMPATIBLE_BASES_MESSAGE = "Bases are not compatible.";
export const INVALID_RATE_MESSAGE = "Rate is invalid.";
export const INVALID_DATE_MESSAGE =
  "Date is invalid; expected an ISO 8601 date or date-time with offset.";
export const INVALID_VALIDITY_MESSAGE =
  "Validity window is invalid; validFrom must be before validUntil.";
export const INEXACT_RESCALE_MESSAGE =
  "Rescaling would discard non-zero digits.";
export const DIVISION_BY_ZERO_MESSAGE = "Cannot divide by zero.";
export const INEXACT_DIVISION_MESSAGE =
  "Division has no exact result in the currency base.";
