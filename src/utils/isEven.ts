/**
 * Is Even for bigint
 * @param input bigint
 * @returns true if even
 */
export const isEven = (input: bigint): boolean => {
  return (input % 2n) === 0n;
};
