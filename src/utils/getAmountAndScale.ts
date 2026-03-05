import { ScaledAmount } from "../types/types.ts";
import { isScaledAmount } from "./isScaledAmount.ts";

/**
 * Get the amount and scale from a ScaledAmount or number
 * @param value
 * @returns
 */
export const getAmountAndScale = (value: ScaledAmount | number | bigint): {
  amount: bigint;
  scale: number;
} => {
  if (isScaledAmount(value)) {
    return { amount: value.amount, scale: value?.scale ?? 0 };
  }

  return { amount: BigInt(value), scale: 0 };
};
