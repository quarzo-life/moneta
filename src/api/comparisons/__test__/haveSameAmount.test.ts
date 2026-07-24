import { describe, expect, test } from "vitest";
import { MGA, USD } from "currencies/index.ts";
import { haveSameAmount, money } from "mod";

describe("haveSameAmount", () => {
  test("two objects with the same amount", () => {
    const d1 = money({ amount: 500n, currency: USD });
    const d2 = money({ amount: 500n, currency: USD });

    expect(haveSameAmount([d1, d2])).toEqual(true);
  });

  test("two objects with different amounts", () => {
    const d1 = money({ amount: 500n, currency: USD });
    const d2 = money({ amount: 800n, currency: USD });

    expect(haveSameAmount([d1, d2])).toEqual(false);
  });

  test("two objects with the same amount after normalization", () => {
    const d1 = money({ amount: 500n, currency: USD });
    const d2 = money({ amount: 5000n, currency: USD, scale: 3 });

    expect(haveSameAmount([d1, d2])).toEqual(true);
  });

  test(
    "two objects with different amounts after normalization",
    () => {
      const d1 = money({ amount: 500n, currency: USD });
      const d2 = money({ amount: 500n, currency: USD, scale: 3 });

      expect(haveSameAmount([d1, d2])).toEqual(false);
    },
  );

  test("non-decimal currency, same amount", () => {
    const d1 = money({ amount: 5n, currency: MGA });
    const d2 = money({ amount: 25n, currency: MGA, scale: 2 });

    expect(haveSameAmount([d1, d2])).toEqual(true);
  });

  test("more than two objects, all equal", () => {
    const d1 = money({ amount: 500n, currency: USD });
    const d2 = money({ amount: 5000n, currency: USD, scale: 3 });
    const d3 = money({ amount: 50000n, currency: USD, scale: 4 });

    expect(haveSameAmount([d1, d2, d3])).toEqual(true);
  });

  test("more than two objects, one differs", () => {
    const d1 = money({ amount: 500n, currency: USD });
    const d2 = money({ amount: 500n, currency: USD });
    const d3 = money({ amount: 800n, currency: USD });

    expect(haveSameAmount([d1, d2, d3])).toEqual(false);
  });
});
