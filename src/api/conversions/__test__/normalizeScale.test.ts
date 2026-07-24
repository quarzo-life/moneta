import { describe, expect, test } from "vitest";
import { USD } from "currencies/index.ts";
import { money, normalizeScale, toSnapshot } from "mod";

describe("normalizeScale: number", () => {
  test(
    "returns an array of Money objects with normalized scale and converted amount",
    () => {
      const d1 = money({ amount: 100n, currency: USD, scale: 2 });
      const d2 = money({ amount: 1000n, currency: USD, scale: 3 });

      const [firstMoneyObject, secondMoneyObject] = normalizeScale([d1, d2]);

      expect(toSnapshot(firstMoneyObject)).toEqual({
        amount: 1000n,
        currency: USD,
        scale: 3,
      });
      expect(toSnapshot(secondMoneyObject)).toEqual({
        amount: 1000n,
        currency: USD,
        scale: 3,
      });
    },
  );
});
