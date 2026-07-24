import { describe, expect, test } from "vitest";
import { EUR, USD } from "currencies/index.ts";
import { money, subtract, toSnapshot } from "mod";

describe("subtract - number", () => {
  test("subtracts positive Money objects", () => {
    const d1 = money({ amount: 500n, currency: USD });
    const d2 = money({ amount: 100n, currency: USD });

    const snapshot = toSnapshot(subtract(d1, d2));

    expect(snapshot).toEqual({
      amount: 400n,
      currency: USD,
      scale: 2,
    });
  });

  test("subtracts negative Money objects", () => {
    const d1 = money({ amount: -500n, currency: USD });
    const d2 = money({ amount: -100n, currency: USD });

    const snapshot = toSnapshot(subtract(d1, d2));

    expect(snapshot).toEqual({
      amount: -400n,
      currency: USD,
      scale: 2,
    });
  });

  test("subtracts positive negative Money objects", () => {
    const d1 = money({ amount: 500n, currency: USD });
    const d2 = money({ amount: -100n, currency: USD });

    const snapshot = toSnapshot(subtract(d1, d2));

    expect(snapshot).toEqual({
      amount: 600n,
      currency: USD,
      scale: 2,
    });
  });

  test("normalizes the result to the highest scale", () => {
    const d1 = money({ amount: 500n, currency: USD });
    const d2 = money({ amount: 1000n, currency: USD, scale: 3 });

    const snapshot = toSnapshot(subtract(d1, d2));

    expect(snapshot).toEqual({
      amount: 4000n,
      currency: USD,
      scale: 3,
    });
  });

  test("throws when using different currencies", () => {
    const d1 = money({ amount: 500n, currency: USD });
    const d2 = money({ amount: 100n, currency: EUR });

    expect(() => subtract(d1, d2)).toThrow(
      "[Money] Objects must have the same currency.",
    );
  });
});
