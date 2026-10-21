import { isArray } from "./isArray.ts";

/**
 * Check whether two currency bases are identical (same radix, or same array of
 * radixes for non-decimal currencies).
 * @param first
 * @param second
 * @returns
 */
export const areBasesCompatible = (
  first: number | readonly number[],
  second: number | readonly number[],
): boolean => {
  const firstIsArray = isArray(first);

  const secondIsArray = isArray(second);

  if (firstIsArray !== secondIsArray) {
    return false;
  }

  if (firstIsArray && secondIsArray) {
    if (first.length !== second.length) {
      return false;
    }
    return first.every((value, index) => value === second[index]);
  }

  return first === second;
};
