import { DIVISION_BY_ZERO_MESSAGE } from "messages";
import { assert } from "helpers/assert.ts";
import type { ScaledAmount } from "types/types.ts";
import { getAmountAndScale } from "./getAmountAndScale.ts";

/**
 * Express `amount / divisor` as an integer fraction whose denominator is
 * strictly positive (the sign is carried by the numerator), as expected by
 * rounding strategies.
 * @param amount the dividend.
 * @param divisor the divisor, possibly scaled (e.g. `{ amount: 5n, scale: 1 }` = 0.5).
 * @returns the numerator and the positive denominator.
 * @throws if the divisor is zero.
 */
export const getDivision = (
  amount: bigint,
  divisor: ScaledAmount | number | bigint,
): { numerator: bigint; denominator: bigint } => {
  const { amount: divisorAmount, scale: divisorScale } = getAmountAndScale(
    divisor,
  );

  assert(divisorAmount !== 0n, DIVISION_BY_ZERO_MESSAGE);

  const numerator = amount * (10n ** BigInt(divisorScale));

  return divisorAmount < 0n
    ? { numerator: -numerator, denominator: -divisorAmount }
    : { numerator, denominator: divisorAmount };
};
