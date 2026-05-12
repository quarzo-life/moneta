import { Rate, ScaledAmount } from "types/types.ts";

/**
 * is Scaled Amount ie object has an amount & scale property
 * @param amount
 * @returns
 */
export function isScaledAmount(
  amount: Rate,
): amount is ScaledAmount {
  return (amount as ScaledAmount)?.hasOwnProperty("amount");
}
