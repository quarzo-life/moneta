import { describe, expect, test } from "vitest";
import * as fc from "fast-check";
import { EUR, MGA, USD } from "currencies/index.ts";
import {
  dangerDivide,
  divideExact,
  down,
  equal,
  money,
  multiply,
  toSnapshot,
  up,
} from "mod";

describe("divideExact: exact quotients", () => {
  test("keeps the scale when the quotient fits", () => {
    const m = money({ amount: 1000n, currency: USD }); // $10.00

    expect(toSnapshot(divideExact(m, 4))).toEqual({
      amount: 250n,
      currency: USD,
      scale: 2,
    });
  });

  test("grows the scale only as much as needed", () => {
    // $1.00 / 8 = $0.125
    expect(toSnapshot(divideExact(money({ amount: 100n, currency: USD }), 8)))
      .toEqual({ amount: 125n, currency: USD, scale: 3 });
    // $1.00 / 16 = $0.0625
    expect(toSnapshot(divideExact(money({ amount: 100n, currency: USD }), 16)))
      .toEqual({ amount: 625n, currency: USD, scale: 4 });
  });

  test("never lowers the scale", () => {
    const m = money({ amount: 1000n, currency: USD }); // $10.00

    expect(toSnapshot(divideExact(m, 2))).toEqual({
      amount: 500n,
      currency: USD,
      scale: 2,
    });
  });

  test("accepts bigint and scaled divisors", () => {
    const m = money({ amount: 1000n, currency: USD }); // $10.00

    expect(divideExact(m, 4n).amount).toBe(250n);
    // $10.00 / 0.25 = $40.00
    expect(toSnapshot(divideExact(m, { amount: 25n, scale: 2 }))).toEqual({
      amount: 4000n,
      currency: USD,
      scale: 2,
    });
  });

  test("handles negative amounts and divisors", () => {
    const m = money({ amount: 100n, currency: EUR });

    expect(divideExact(m, -8).amount).toBe(-125n);
    expect(divideExact(money({ amount: -100n, currency: EUR }), -8).amount)
      .toBe(125n);
  });

  test("handles zero amounts", () => {
    expect(toSnapshot(divideExact(money({ amount: 0n, currency: EUR }), 3)))
      .toEqual({ amount: 0n, currency: EUR, scale: 2 });
  });

  test("uses the currency base for non-decimal currencies", () => {
    // MGA is base 5: 1 at scale 1 divided by 5 is 1 at scale 2
    expect(toSnapshot(divideExact(money({ amount: 1n, currency: MGA }), 5)))
      .toEqual({ amount: 1n, currency: MGA, scale: 2 });
  });
});

describe("divideExact: errors", () => {
  test("throws on non-terminating quotients", () => {
    const m = money({ amount: 100n, currency: USD });

    expect(() => divideExact(m, 3)).toThrow(
      "[Money] Division has no exact result in the currency base.",
    );
    // $10.00 / 0.3
    expect(() => divideExact(m, { amount: 3n, scale: 1 })).toThrow(
      "[Money] Division has no exact result in the currency base.",
    );
  });

  test("throws when the base can't represent the quotient", () => {
    // 1/2 has no finite representation in base 5
    expect(() => divideExact(money({ amount: 1n, currency: MGA }), 2))
      .toThrow("[Money] Division has no exact result in the currency base.");
  });

  test("throws on a zero divisor", () => {
    expect(() => divideExact(money({ amount: 100n, currency: USD }), 0))
      .toThrow("[Money] Cannot divide by zero.");
  });
});

describe("divideExact: properties", () => {
  // Divisors of the form ±2^a·5^b always give an exact decimal quotient.
  const terminatingDivisor = fc
    .tuple(
      fc.integer({ min: 0, max: 8 }),
      fc.integer({ min: 0, max: 8 }),
      fc.boolean(),
    )
    .map(([a, b, negative]) =>
      (negative ? -1n : 1n) * 2n ** BigInt(a) * 5n ** BigInt(b)
    );

  test("multiplying the quotient back gives the dividend", () => {
    fc.assert(
      fc.property(fc.bigInt(), terminatingDivisor, (amount, divisor) => {
        const m = money({ amount, currency: EUR });
        const back = multiply(divideExact(m, divisor), Number(divisor));

        expect(equal(back, m)).toBe(true);
      }),
    );
  });

  test("agrees with dangerDivide at the same scale, whatever the rounding", () => {
    fc.assert(
      fc.property(fc.bigInt(), terminatingDivisor, (amount, divisor) => {
        const m = money({ amount, currency: EUR });
        const exact = divideExact(m, divisor);

        expect(dangerDivide(m, divisor, down, exact.scale).amount).toBe(
          exact.amount,
        );
        expect(dangerDivide(m, divisor, up, exact.scale).amount).toBe(
          exact.amount,
        );
      }),
    );
  });

  test("throws exactly when dangerDivide would have to round at any scale", () => {
    fc.assert(
      fc.property(
        fc.bigInt({ min: -10000n, max: 10000n }),
        fc.bigInt({ min: 1n, max: 1000n }),
        (amount, divisor) => {
          const m = money({ amount, currency: EUR });
          // A divisor ≤ 1000 needs at most 9 extra digits (2^9 = 512), so every
          // terminating quotient is exact at scale 32.
          const deep = 32;
          const isExactDeep = dangerDivide(m, divisor, down, deep).amount ===
            dangerDivide(m, divisor, up, deep).amount;

          if (isExactDeep) {
            expect(() => divideExact(m, divisor)).not.toThrow();
          } else {
            expect(() => divideExact(m, divisor)).toThrow();
          }
        },
      ),
    );
  });
});
