import { describe, expect, test } from "vitest";
import { EUR, MGA, USD } from "currencies/index.ts";
import { equal, money } from "mod";

describe("equal - bigint", () => {
  test("equal - bigint (decimal currencies)", () => {
    const d1 = money({ amount: 500n, currency: USD });
    const d2 = money({ amount: 500n, currency: USD });

    expect(equal(d1, d2)).toEqual(true);
  });

  test("equal - bigint (different amounts)", () => {
    const d1 = money({ amount: 500n, currency: USD });
    const d2 = money({ amount: 800n, currency: USD });

    expect(equal(d1, d2)).toEqual(false);
  });

  test("equal - bigint (different currencies)", () => {
    const d1 = money({ amount: 500n, currency: USD });
    const d2 = money({ amount: 500n, currency: EUR });

    expect(equal(d1, d2)).toEqual(false);
  });

  test("equal - bigint (different amounts and currencies)", () => {
    const d1 = money({ amount: 500n, currency: USD });
    const d2 = money({ amount: 800n, currency: EUR });

    expect(equal(d1, d2)).toEqual(false);
  });

  test("equal - bigint (same amount after normalization)", () => {
    const d1 = money({ amount: 500n, currency: USD });
    const d2 = money({ amount: 5000n, currency: USD, scale: 3 });

    expect(equal(d1, d2)).toEqual(true);
  });

  test("equal - bigint (different amount after normalization)", () => {
    const d1 = money({ amount: 500n, currency: USD });
    const d2 = money({ amount: 500n, currency: USD, scale: 3 });

    expect(equal(d1, d2)).toEqual(false);
  });

  test("equal - bigint (non-decimal currencies)", () => {
    const d1 = money({ amount: 5n, currency: MGA });
    const d2 = money({ amount: 5n, currency: MGA });

    expect(equal(d1, d2)).toEqual(true);
  });

  test("equal - bigint (non-decimal different amounts)", () => {
    const d1 = money({ amount: 5n, currency: MGA });
    const d2 = money({ amount: 8n, currency: MGA });

    expect(equal(d1, d2)).toEqual(false);
  });

  test("equal - bigint (non-decimal different currencies)", () => {
    const d1 = money({ amount: 500n, currency: USD });
    const d2 = money({ amount: 500n, currency: MGA });

    expect(equal(d1, d2)).toEqual(false);
  });

  test(
    "equal - bigint (non-decimal different amount and currency)",
    () => {
      const d1 = money({ amount: 500n, currency: USD });
      const d2 = money({ amount: 8n, currency: MGA });

      expect(equal(d1, d2)).toEqual(false);
    },
  );

  test(
    "equal - bigint (non-decimal same amount after normalization)",
    () => {
      const d1 = money({ amount: 5n, currency: MGA });
      const d2 = money({ amount: 25n, currency: MGA, scale: 2 });

      expect(equal(d1, d2)).toEqual(true);
    },
  );

  test(
    "equal - bigint (non-decimal different amount after normalization)",
    () => {
      const d1 = money({ amount: 25n, currency: MGA });
      const d2 = money({ amount: 25n, currency: MGA, scale: 2 });

      expect(equal(d1, d2)).toEqual(false);
    },
  );
});
