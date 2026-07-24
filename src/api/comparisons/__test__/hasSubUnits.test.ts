import { describe, expect, test } from "vitest";
import { hasSubUnits, MGA, money, USD } from "mod";

describe("hasSubUnits - decimal currencies", () => {
  test("returns false when there are no sub-units", () => {
    const d = money({ amount: 1100n, currency: USD });

    expect(hasSubUnits(d)).toEqual(false);
  });

  test(
    "returns true when there are sub-units based on a custom scale",
    () => {
      const d = money({ amount: 1100n, currency: USD, scale: 3 });

      expect(hasSubUnits(d)).toEqual(true);
    },
  );

  test("returns true when there are sub-units", () => {
    const d = money({ amount: 1150n, currency: USD });

    expect(hasSubUnits(d)).toEqual(true);
  });

  test(
    "returns false when there are no sub-units based on a custom scale",
    () => {
      const d = money({ amount: 1150n, currency: USD, scale: 1 });

      expect(hasSubUnits(d)).toEqual(false);
    },
  );
});

describe("hasSubUnits - non-decimal currencies", () => {
  const GBP = { code: "GBP", base: [20, 12], exponent: 1 };

  test("returns false when there are no sub-units", () => {
    const d = money({ amount: 10n, currency: MGA });

    expect(hasSubUnits(d)).toEqual(false);
  });

  test("returns true when there are sub-units", () => {
    const d = money({ amount: 11n, currency: MGA });

    expect(hasSubUnits(d)).toEqual(true);
  });

  test(
    "returns false when there are no sub-units based on a multi-base",
    () => {
      const d = money({ amount: 240n, currency: GBP });

      expect(hasSubUnits(d)).toEqual(false);
    },
  );
});
