import { describe, expect, test } from "vitest";
import { EUR, MGA, USD } from "currencies/index.ts";
import { lessThanOrEqual, money } from "mod";

describe("lessThanOrEqual - bigint", () => {
  test(
    "lessThanOrEqual - bigint (decimal currencies: less than)",
    () => {
      const d1 = money({ amount: 500n, currency: USD });
      const d2 = money({ amount: 800n, currency: USD });

      expect(lessThanOrEqual(d1, d2)).toEqual(true);
    },
  );

  test(
    "lessThanOrEqual - bigint (decimal currencies: equal)",
    () => {
      const d1 = money({ amount: 500n, currency: USD });
      const d2 = money({ amount: 500n, currency: USD });

      expect(lessThanOrEqual(d1, d2)).toEqual(true);
    },
  );

  test(
    "lessThanOrEqual - bigint (decimal currencies: greater than)",
    () => {
      const d1 = money({ amount: 800n, currency: USD });
      const d2 = money({ amount: 500n, currency: USD });

      expect(lessThanOrEqual(d1, d2)).toEqual(false);
    },
  );

  test(
    "lessThanOrEqual - bigint (decimal currencies: normalize scale)",
    () => {
      const d1 = money({ amount: 800n, currency: USD });
      const d2 = money({ amount: 5000n, currency: USD, scale: 3 });

      expect(lessThanOrEqual(d1, d2)).toEqual(false);
    },
  );

  test(
    "lessThanOrEqual - bigint (decimal currencies: different currency)",
    () => {
      const d1 = money({ amount: 800n, currency: USD });
      const d2 = money({ amount: 500n, currency: EUR });

      expect(() => lessThanOrEqual(d1, d2)).toThrow(
        "[Money] Objects must have the same currency.",
      );
    },
  );

  test(
    "lessThanOrEqual - bigint (non-decimal currencies: less than)",
    () => {
      const d1 = money({ amount: 5n, currency: MGA });
      const d2 = money({ amount: 8n, currency: MGA });

      expect(lessThanOrEqual(d1, d2)).toEqual(true);
    },
  );

  test(
    "lessThanOrEqual - bigint (non-decimal currencies: equal)",
    () => {
      const d1 = money({ amount: 5n, currency: MGA });
      const d2 = money({ amount: 5n, currency: MGA });

      expect(lessThanOrEqual(d1, d2)).toEqual(true);
    },
  );

  test(
    "lessThanOrEqual - bigint (non-decimal currencies: greater than)",
    () => {
      const d1 = money({ amount: 8n, currency: MGA });
      const d2 = money({ amount: 5n, currency: MGA });

      expect(lessThanOrEqual(d1, d2)).toEqual(false);
    },
  );

  test(
    "lessThanOrEqual - bigint (non-decimal currencies: normalize scale)",
    () => {
      const d1 = money({ amount: 8n, currency: MGA });
      const d2 = money({ amount: 25n, currency: MGA, scale: 2 });

      expect(lessThanOrEqual(d1, d2)).toEqual(false);
    },
  );

  test(
    "lessThanOrEqual - bigint (non-decimal currencies: different currency)",
    () => {
      const d1 = money({ amount: 500n, currency: USD });
      const d2 = money({ amount: 500n, currency: MGA });

      expect(() => lessThanOrEqual(d1, d2)).toThrow(
        "[Money] Objects must have the same currency.",
      );
    },
  );
});
