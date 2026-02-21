/**
 * Returns the minimum for bigint arrays.
 *
 * @param values - An array of bigint values.
 *
 * @returns The minimum bigint value.
 */
export const minBigIntArray = (values: readonly bigint[]): bigint => {
  const length = values.length;
  if (length === 0) {
    throw new Error("Array must not be empty");
  }

  let min = values[0];

  for (let i = 1; i < length; i++) {
    const v = values[i];
    if (v < min) {
      min = v;
    }
  }

  return min;
};
