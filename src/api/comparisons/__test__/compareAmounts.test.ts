import { describe, expect, test } from "vitest";
import { EUR, USD } from "currencies/index.ts";
import { money } from "mod";
import { compareAmounts } from "api/comparisons/compareAmounts.ts";

describe("compareAmounts", () => {
  test("compares monetary values with the given predicate", () => {
    const greater = money({ amount: 800n, currency: USD });
    const lesser = money({ amount: 500n, currency: USD });

    expect(compareAmounts(greater, lesser, (a, b) => a > b)).toEqual(true);
    expect(compareAmounts(lesser, greater, (a, b) => a > b)).toEqual(false);
    expect(compareAmounts(greater, greater, (a, b) => a === b)).toEqual(true);
  });

  test(
    "treats values equal across different scales as equal",
    () => {
      const highScale = money({ amount: 8000n, currency: USD, scale: 2 });
      const lowScale = money({ amount: 80n, currency: USD, scale: 0 });

      expect(compareAmounts(highScale, lowScale, (a, b) => a === b)).toEqual(
        true,
      );
    },
  );

  test("throws when currencies differ", () => {
    const d1 = money({ amount: 500n, currency: USD });
    const d2 = money({ amount: 500n, currency: EUR });

    expect(() => compareAmounts(d1, d2, (a, b) => a > b)).toThrow(
      "[Money] Objects must have the same currency.",
    );
  });
});
