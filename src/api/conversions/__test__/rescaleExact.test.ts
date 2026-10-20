import { describe, expect, test } from "vitest";
import * as fc from "fast-check";
import { EUR, MGA, money, rescaleExact, toSnapshot, USD } from "mod";

describe("rescaleExact: explicit scale", () => {
  test("increases the scale", () => {
    const d = money({ amount: 123n, currency: EUR, scale: 2 });

    expect(toSnapshot(rescaleExact(d, 4))).toEqual({
      amount: 12300n,
      currency: EUR,
      scale: 4,
    });
  });

  test("decreases the scale when the dropped digits are zeros", () => {
    // 1,2300 → 1,23
    const d = money({ amount: 12300n, currency: EUR, scale: 4 });

    expect(toSnapshot(rescaleExact(d, 2))).toEqual({
      amount: 123n,
      currency: EUR,
      scale: 2,
    });
  });

  test("throws when a non-zero digit would be dropped", () => {
    // 1,234 → 1,23 is refused
    const d = money({ amount: 1234n, currency: EUR, scale: 3 });

    expect(() => rescaleExact(d, 2)).toThrow(
      "[Money] Rescaling would discard non-zero digits.",
    );
  });

  test("throws for negative amounts too", () => {
    const d = money({ amount: -1234n, currency: EUR, scale: 3 });

    expect(() => rescaleExact(d, 2)).toThrow(
      "[Money] Rescaling would discard non-zero digits.",
    );

    const exact = money({ amount: -1230n, currency: EUR, scale: 3 });

    expect(toSnapshot(rescaleExact(exact, 2))).toEqual({
      amount: -123n,
      currency: EUR,
      scale: 2,
    });
  });

  test("can go below the currency exponent when exact", () => {
    const d = money({ amount: 500n, currency: EUR, scale: 2 });

    expect(toSnapshot(rescaleExact(d, 0))).toEqual({
      amount: 5n,
      currency: EUR,
      scale: 0,
    });
  });

  test("returns the same object when the scale is unchanged", () => {
    const d = money({ amount: 1234n, currency: EUR, scale: 3 });

    expect(rescaleExact(d, 3)).toBe(d);
  });

  test("handles zero amounts", () => {
    const d = money({ amount: 0n, currency: EUR, scale: 5 });

    expect(toSnapshot(rescaleExact(d, 0))).toEqual({
      amount: 0n,
      currency: EUR,
      scale: 0,
    });
  });

  test("throws on a negative or non-integer scale", () => {
    const d = money({ amount: 123n, currency: EUR });

    expect(() => rescaleExact(d, -1)).toThrow("[Money] Scale is invalid.");
    expect(() => rescaleExact(d, 1.5)).toThrow("[Money] Scale is invalid.");
  });

  test("uses the currency base for non-decimal currencies", () => {
    // MGA is base 5: 25 at scale 2 is 5 at scale 1, 26 at scale 2 is not exact
    expect(
      toSnapshot(
        rescaleExact(money({ amount: 25n, currency: MGA, scale: 2 }), 1),
      ),
    )
      .toEqual({ amount: 5n, currency: MGA, scale: 1 });
    expect(() =>
      rescaleExact(money({ amount: 26n, currency: MGA, scale: 2 }), 1)
    ).toThrow("[Money] Rescaling would discard non-zero digits.");
  });

  test("round-trips: scaling up then back down is the identity", () => {
    fc.assert(
      fc.property(
        fc.bigInt(),
        fc.integer({ min: 0, max: 10 }),
        fc.integer({ min: 0, max: 10 }),
        (amount, scale, extra) => {
          const d = money({ amount, currency: EUR, scale });
          const back = rescaleExact(rescaleExact(d, scale + extra), scale);

          expect(toSnapshot(back)).toEqual(toSnapshot(d));
        },
      ),
    );
  });
});

describe("rescaleExact: trimming (no scale)", () => {
  test("trims down to the currency exponent", () => {
    const d = money({ amount: 500000n, currency: USD, scale: 5 });

    expect(toSnapshot(rescaleExact(d))).toEqual({
      amount: 500n,
      currency: USD,
      scale: 2,
    });
  });

  test("trims down to the smallest lossless scale", () => {
    const d = money({ amount: 55550n, currency: USD, scale: 4 });

    expect(toSnapshot(rescaleExact(d))).toEqual({
      amount: 5555n,
      currency: USD,
      scale: 3,
    });
  });

  test("doesn't trim when there's nothing to trim", () => {
    const d = money({ amount: 5555n, currency: USD, scale: 3 });

    expect(rescaleExact(d)).toBe(d);
  });

  test("doesn't crash on zero amounts", () => {
    const d = money({ amount: 0n, currency: USD });

    expect(toSnapshot(rescaleExact(d))).toEqual({
      amount: 0n,
      currency: USD,
      scale: 2,
    });
  });
});
