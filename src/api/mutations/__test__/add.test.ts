import { describe, expect, test } from "vitest";
import { EUR, USD } from "currencies/index.ts";
import { add, money, toSnapshot } from "mod";

describe("add - number", () => {
  test("add - number (decimal currencies)", () => {
    const d1 = money({ amount: 500n, currency: USD });
    const d2 = money({ amount: 100n, currency: USD });

    const snapshot = toSnapshot(add(d1, d2));
    expect(snapshot).toEqual({ amount: 600n, currency: USD, scale: 2 });
  });

  test("add - number (negative values)", () => {
    const d1 = money({ amount: -500n, currency: USD });
    const d2 = money({ amount: -100n, currency: USD });

    const snapshot = toSnapshot(add(d1, d2));
    expect(snapshot).toEqual({ amount: -600n, currency: USD, scale: 2 });
  });

  test("add - number (normalizing scale)", () => {
    const d1 = money({ amount: 500n, currency: USD });
    const d2 = money({ amount: 1000n, currency: USD, scale: 3 });

    const snapshot = toSnapshot(add(d1, d2));
    expect(snapshot).toEqual({ amount: 6000n, currency: USD, scale: 3 });
  });

  test("add - number (different currencies)", () => {
    const d1 = money({ amount: 500n, currency: USD });
    const d2 = money({ amount: 100n, currency: EUR });

    expect(() => add(d1, d2)).toThrow(
      "[Money] Objects must have the same currency.",
    );
  });
});
