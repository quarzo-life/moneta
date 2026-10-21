import type { CurrencyCode } from "currencies/index.ts";
import {
  INCOMPATIBLE_BASES_MESSAGE,
  INVALID_DATE_MESSAGE,
  INVALID_VALIDITY_MESSAGE,
} from "messages";
import { assert } from "helpers/assert.ts";
import type { Currency, FXRate, FXRateContext, Rate } from "types/types.ts";
import { areBasesCompatible } from "utils/areBasesCompatible.ts";
import { resolveCurrency } from "utils/resolveCurrency.ts";
import { resolveRate } from "utils/resolveRate.ts";

const ISO_8601 =
  /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:\d{2}))?$/;

const toTimestamp = (value: string): number => {
  assert(
    typeof value === "string" && ISO_8601.test(value),
    INVALID_DATE_MESSAGE,
  );

  // Date.parse rolls impossible days over (2026-02-30 → March 2), so the
  // calendar date must round-trip.
  const day = value.slice(0, 10);
  const dayTimestamp = Date.parse(day);
  assert(
    !Number.isNaN(dayTimestamp) &&
      new Date(dayTimestamp).toISOString().slice(0, 10) === day,
    INVALID_DATE_MESSAGE,
  );

  const timestamp = Date.parse(value);
  assert(!Number.isNaN(timestamp), INVALID_DATE_MESSAGE);

  return timestamp;
};

const resolveContext = (context: FXRateContext): FXRateContext => {
  const { quotedAt, validFrom, validUntil, derivedFrom } = context;

  if (quotedAt !== undefined) {
    toTimestamp(quotedAt);
  }

  const from = validFrom === undefined ? undefined : toTimestamp(validFrom);
  const until = validUntil === undefined ? undefined : toTimestamp(validUntil);

  if (from !== undefined && until !== undefined) {
    assert(from < until, INVALID_VALIDITY_MESSAGE);
  }

  return Object.freeze({
    ...context,
    ...(derivedFrom && { derivedFrom: Object.freeze([...derivedFrom]) }),
  });
};

/** Options accepted by {@link fxRate} to build an {@link FXRate} object. */
export type FXRateOptions = {
  from: Currency | CurrencyCode;
  to: Currency | CurrencyCode;
  rate: Rate;
  context?: FXRateContext;
};

/**
 * Create a new FXRate object: 1 unit of `from` equals `rate` units of `to`.
 *
 * Validates its inputs and returns a frozen object whose `rate` is normalized
 * to a scaled amount (`{ amount: bigint, scale: number }`).
 *
 * @param from Source currency, as a {@link Currency} or a known {@link CurrencyCode}.
 * @param to Target currency, as a {@link Currency} or a known {@link CurrencyCode}.
 * @param rate Strictly positive scaled amount or integer. Use a scaled amount
 * for fractional rates: `{ amount: 1826818n, scale: 4 }` for 182.6818.
 * @param context Optional metadata (id, source, kind, quotedAt, validFrom,
 * validUntil, derivedFrom). Dates must be ISO 8601 and `validFrom` must be
 * before `validUntil`.
 *
 * @example
 * import { fxRate } from "jsr:@quarzo-life/moneta";
 *
 * const fx = fxRate({
 *   from: "EUR",
 *   to: "USD",
 *   rate: { amount: 10823n, scale: 4 }, // 1 EUR = 1.0823 USD
 *   context: { source: "ECB", kind: "reference", quotedAt: "2026-10-21" },
 * });
 */
export const fxRate = ({ from, to, rate, context }: FXRateOptions): FXRate => {
  const resolvedFrom = resolveCurrency(from);

  const resolvedTo = resolveCurrency(to);

  assert(
    areBasesCompatible(resolvedFrom.base, resolvedTo.base),
    INCOMPATIBLE_BASES_MESSAGE,
  );

  const resolvedRate = resolveRate(rate);

  return Object.freeze({
    from: resolvedFrom,
    to: resolvedTo,
    rate: Object.freeze(resolvedRate),
    ...(context && { context: resolveContext(context) }),
  });
};
