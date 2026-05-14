import type { Currency } from "types/types.ts";

/**
 * Macedonian denar
 * 2026 : in theory scale=2, but they no more use cents (deni)
 */
export const MKD: Currency = {
  code: "MKD",
  base: 10,
  exponent: 0,
};
