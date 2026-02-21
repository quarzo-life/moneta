/**
 * Returns the maximum for bigint arrays.
 *
 * @param values - An array of bigint values.
 *
 * @returns The maximum bigint value.
 */
export const maxBigIntArray = (values: readonly bigint[]): bigint => {
  const length = values.length;
  if (length === 0) {
    throw new Error("Array must not be empty");
  }

  let max = values[0];

  for (let i = 1; i < length; i++) {
    const v = values[i];
    if (v > max) {
      max = v;
    }
  }

  return max;
};
