import { describe, expect, test } from "vitest";
import { EUR, JPY, MGA } from "currencies/index.ts";
import { convert, money, toSnapshot } from "mod";

describe("convert - market rate string", () => {
  test("converts using a comma decimal rate", () => {
    const d = money({ amount: 1000n, currency: EUR });

    const snapshot = toSnapshot(
      convert(d, { from: EUR, to: JPY, rate: { amount: 1826818n, scale: 4 } }),
    );

    expect(snapshot).toEqual({
      amount: 1827n,
      scale: 0,
      currency: JPY,
    });
  });

  test("expands scale to target exponent when needed", () => {
    const d = money({ amount: 100n, currency: JPY });

    const snapshot = toSnapshot(
      convert(d, { from: JPY, to: EUR, rate: 1 }),
    );

    expect(snapshot).toEqual({
      amount: 10000n,
      scale: 2,
      currency: EUR,
    });
  });
});

test("convert - incompatible bases", () => {
  const d = money({ amount: 100n, currency: EUR });

  expect(() => convert(d, { from: EUR, to: MGA, rate: 1 })).toThrow(
    "[Money] Bases are not compatible.",
  );
});
