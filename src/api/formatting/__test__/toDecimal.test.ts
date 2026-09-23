import { describe, expect, test } from "vitest";
import { USD } from "currencies/index.ts";
import { money, toDecimal } from "mod";

describe("toDecimal", () => {
  test("formats a decimal currency", () => {
    const d = money({ amount: 1050n, currency: USD });

    expect(toDecimal(d)).toBe("10.50");
  });

  test("applies a custom transformer", () => {
    const d = money({ amount: 1050n, currency: USD });

    expect(toDecimal(d, ({ value, currency }) => `${currency.code} ${value}`))
      .toBe("USD 10.50");
  });

  test("throws for a multi-based, non-decimal currency", () => {
    const d = money({
      amount: 250n,
      currency: { code: "GBP", base: [20, 12], exponent: 2 },
    });

    expect(() => toDecimal(d)).toThrow("[Money] Currency is not decimal.");
  });

  test("throws for a scalar base which is a multiple of ten but not decimal", () => {
    const d = money({
      amount: 250n,
      currency: { code: "XXX", base: 240, exponent: 1 },
    });

    expect(() => toDecimal(d)).toThrow("[Money] Currency is not decimal.");
  });
});
