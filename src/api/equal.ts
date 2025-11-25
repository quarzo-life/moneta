import { Money } from "../../mod.ts";
import { haveSameAmount, haveSameCurrency } from "./index.ts";

/**
 * Are Money objects equal ?
 * @param m1 a Money object
 * @param m2 a Money object
 * @returns true if equal
 */
export const equal = (m1: Money, m2: Money): boolean => {
  return haveSameCurrency([m1, m2]) && haveSameAmount([m1, m2]);
};
