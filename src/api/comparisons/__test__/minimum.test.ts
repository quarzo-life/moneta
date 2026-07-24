import { describe, expect, test } from "vitest";
import { EUR, USD } from "currencies/index.ts";
import { minimum, money, toSnapshot } from "mod";

describe("minimum - bigint", () => {
  test("minimum - bigint (returns smallest)", () => {
    const d1 = money({ amount: 150n, currency: USD });
    const d2 = money({ amount: 50n, currency: USD });

    const snapshot = toSnapshot(minimum([d1, d2]));

    expect(snapshot).toEqual({
      amount: 50n,
      currency: USD,
      scale: 2,
    });
  });

  test("minimum - bigint (after normalization)", () => {
    const d1 = money({ amount: 500n, currency: USD });
    const d2 = money({ amount: 1000n, currency: USD, scale: 3 });

    const snapshot = toSnapshot(minimum([d1, d2]));

    expect(snapshot).toEqual({
      amount: 1000n,
      currency: USD,
      scale: 3,
    });
  });

  test("minimum - bigint (different currencies)", () => {
    const d1 = money({ amount: 150n, currency: USD });
    const d2 = money({ amount: 50n, currency: EUR });

    expect(() => minimum([d1, d2])).toThrow(
      "[Money] Objects must have the same currency.",
    );
  });
});
