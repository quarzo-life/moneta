import { INVALID_RATE_MESSAGE } from "messages";
import { assert } from "helpers/assert.ts";
import type { Rate } from "types/types.ts";
import { isScaledAmount } from "./isScaledAmount.ts";

const toBigInt = (value: bigint | number): bigint => {
  if (typeof value === "bigint") {
    return value;
  }

  assert(Number.isSafeInteger(value), INVALID_RATE_MESSAGE);

  return BigInt(value);
};

/**
 * Validate a Rate and normalize it to a scaled amount.
 *
 * Throws unless the amount is a strictly positive integer (`bigint` or safe
 * integer `number`) and the scale a non-negative integer.
 * @param rate
 * @returns
 */
export const resolveRate = (rate: Rate): {
  amount: bigint;
  scale: number;
} => {
  const { amount, scale = 0 } = isScaledAmount(rate) ? rate : { amount: rate };

  const resolvedAmount = toBigInt(amount);

  assert(resolvedAmount > 0n, INVALID_RATE_MESSAGE);

  assert(Number.isInteger(scale) && scale >= 0, INVALID_RATE_MESSAGE);

  return { amount: resolvedAmount, scale };
};
