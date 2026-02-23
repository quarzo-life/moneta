import { absolute } from "./absolute.ts";

/**
 * is Half ie same distance between two integers
 * @param input
 * @param total
 * @returns boolean
 */
export const isHalf = (input: bigint, total: bigint): boolean => {
  const remainder = absolute(input % total);
  const difference = total - remainder;

  return difference === remainder;
};
