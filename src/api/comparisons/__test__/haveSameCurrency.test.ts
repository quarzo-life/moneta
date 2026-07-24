import { describe, expect, test } from "vitest";
import { EUR, MGA, USD } from "currencies/index.ts";
import { haveSameCurrency, money } from "mod";

describe("haveSameCurrency", () => {
  test("two objects with the same currency", () => {
    const d1 = money({ amount: 500n, currency: USD });
    const d2 = money({ amount: 800n, currency: USD });

    expect(haveSameCurrency([d1, d2])).toEqual(true);
  });

  test("two objects with different currencies", () => {
    const d1 = money({ amount: 500n, currency: USD });
    const d2 = money({ amount: 500n, currency: EUR });

    expect(haveSameCurrency([d1, d2])).toEqual(false);
  });

  test("two objects with the same non-decimal currency", () => {
    const d1 = money({ amount: 5n, currency: MGA });
    const d2 = money({ amount: 8n, currency: MGA });

    expect(haveSameCurrency([d1, d2])).toEqual(true);
  });

  test("decimal vs non-decimal currency", () => {
    const d1 = money({ amount: 500n, currency: USD });
    const d2 = money({ amount: 5n, currency: MGA });

    expect(haveSameCurrency([d1, d2])).toEqual(false);
  });

  test("more than two objects, all same currency", () => {
    const d1 = money({ amount: 500n, currency: USD });
    const d2 = money({ amount: 800n, currency: USD });
    const d3 = money({ amount: 1000n, currency: USD });

    expect(haveSameCurrency([d1, d2, d3])).toEqual(true);
  });

  test("more than two objects, one differs", () => {
    const d1 = money({ amount: 500n, currency: USD });
    const d2 = money({ amount: 800n, currency: USD });
    const d3 = money({ amount: 1000n, currency: EUR });

    expect(haveSameCurrency([d1, d2, d3])).toEqual(false);
  });
});
