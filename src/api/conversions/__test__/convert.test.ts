import { describe, expect, test } from "vitest";
import { EUR, JPY, MGA, USD } from "currencies/index.ts";
import { convert, down, fxRate, halfEven, money, toSnapshot } from "mod";

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

describe("convert - rounding", () => {
  // 1,25 EUR * 1.1 = 1.375 USD
  const m = money({ amount: 125n, currency: EUR });
  const fx = { from: EUR, to: USD, rate: { amount: 11n, scale: 1 } };

  test("rounds halfUp by default", () => {
    expect(convert(m, fx).amount).toBe(138n);
  });

  test("uses the given rounding strategy", () => {
    expect(convert(m, fx, down).amount).toBe(137n);
    expect(convert(m, fx, halfEven).amount).toBe(138n);
    expect(convert(money({ amount: 115n, currency: EUR }), fx, halfEven).amount)
      .toBe(126n); // 1.265 → 1.26
  });
});

describe("convert - FXRate built with fxRate", () => {
  test("ignores the context", () => {
    const fx = fxRate({
      from: "EUR",
      to: "JPY",
      rate: { amount: 1826818n, scale: 4 },
      context: { source: "ECB", kind: "reference", quotedAt: "2026-10-21" },
    });

    expect(toSnapshot(convert(money({ amount: 1000n, currency: EUR }), fx)))
      .toEqual({ amount: 1827n, scale: 0, currency: JPY });
  });
});

describe("convert - invalid rates", () => {
  const m = money({ amount: 100n, currency: EUR });

  test.each([
    0,
    -2,
    1.5,
    0n,
    { amount: -1n, scale: 2 },
    { amount: 1n, scale: -1 },
    { amount: 1n, scale: 0.5 },
  ])("throws for rate %s", (rate) => {
    expect(() => convert(m, { from: EUR, to: USD, rate })).toThrow(
      "[Money] Rate is invalid.",
    );
  });

  test("accepts a safe-integer number amount in a scaled rate", () => {
    const rate = { amount: 108, scale: 2 } as unknown as { amount: bigint };

    expect(convert(m, { from: EUR, to: USD, rate }).amount).toBe(108n);
  });
});

test("convert - currency mismatch", () => {
  expect(() =>
    convert(money({ amount: 100n, currency: USD }), {
      from: EUR,
      to: JPY,
      rate: 1,
    })
  ).toThrow("[Money] Objects must have the same currency.");
});
