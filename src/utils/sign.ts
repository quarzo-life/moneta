/**
 * Sign of a bigint
 * @param input
 * @returns +1n / -1n
 */
export const sign = (input: bigint): bigint => {
  if (input === 0n) {
    return 0n;
  }

  return (input < 0n) ? -1n : 1n;
};
