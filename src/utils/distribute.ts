/**
 * Distribute function for allocating a value based on ratios.
 *
 * @returns The distribute amount.
 */
export const distribute = (
  value: bigint,
  ratios: readonly bigint[],
): readonly bigint[] => {
  const total = ratios.reduce((a, b) => a + b, 0n);

  if (total === 0n) {
    return ratios;
  }

  let remainder = value;

  const shares = ratios.map((ratio) => {
    const share = (value * BigInt(ratio)) / BigInt(total) ||
      0n;

    remainder = remainder - share;

    return share;
  });

  const isPositive = value >= 0;

  const compare = (v: bigint) => {
    return (isPositive ? v > 0n : v < 0n);
  };

  const amount = isPositive ? 1n : -1n;

  let i = 0;

  while (compare(remainder)) {
    if (ratios[i] !== 0n) {
      shares[i] += amount;
      remainder -= amount;
    }

    i++;
  }

  return shares;
};
