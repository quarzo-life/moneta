import { describe, expect, test } from "vitest";
import { EUR, JPY, MGA, USD } from "currencies/index.ts";
import { fxRate } from "mod";

describe("fxRate", () => {
  test("resolves currency codes and normalizes the rate", () => {
    const fx = fxRate({ from: "EUR", to: "USD", rate: 2 });

    expect(fx).toEqual({
      from: EUR,
      to: USD,
      rate: { amount: 2n, scale: 0 },
    });
    expect("context" in fx).toBe(false);
  });

  test("keeps a scaled rate and defaults its scale to 0", () => {
    expect(
      fxRate({ from: EUR, to: JPY, rate: { amount: 1826818n, scale: 4 } })
        .rate,
    ).toEqual({ amount: 1826818n, scale: 4 });
    expect(fxRate({ from: EUR, to: USD, rate: { amount: 3n } }).rate)
      .toEqual({ amount: 3n, scale: 0 });
  });

  test("returns a deeply frozen object", () => {
    const fx = fxRate({
      from: EUR,
      to: USD,
      rate: { amount: 10823n, scale: 4 },
      context: { source: "ECB", derivedFrom: [] },
    });

    expect(Object.isFrozen(fx)).toBe(true);
    expect(Object.isFrozen(fx.rate)).toBe(true);
    expect(Object.isFrozen(fx.context)).toBe(true);
    expect(Object.isFrozen(fx.context?.derivedFrom)).toBe(true);
  });

  test("keeps the context fields", () => {
    const eurUsd = fxRate({
      from: EUR,
      to: USD,
      rate: { amount: 108n, scale: 2 },
    });
    const usdJpy = fxRate({ from: USD, to: JPY, rate: 150 });

    const context = {
      id: "q-42",
      source: "broker",
      kind: "executable",
      quotedAt: "2026-10-21T14:03:12Z",
      validFrom: "2026-10-21T14:03:12+02:00",
      validUntil: "2026-10-21T14:03:42+02:00",
      derivedFrom: [eurUsd, usdJpy],
    };

    expect(
      fxRate({ from: EUR, to: JPY, rate: { amount: 162n }, context }).context,
    ).toEqual(context);
  });

  test("accepts a custom kind", () => {
    expect(
      fxRate({ from: EUR, to: USD, rate: 1, context: { kind: "internal" } })
        .context?.kind,
    ).toBe("internal");
  });

  test.each([0, -1, 1.5, 0n, -5n])("throws for invalid rate %s", (rate) => {
    expect(() => fxRate({ from: EUR, to: USD, rate })).toThrow(
      "[Money] Rate is invalid.",
    );
  });

  test.each([-1, 1.5])("throws for invalid rate scale %s", (scale) => {
    expect(() => fxRate({ from: EUR, to: USD, rate: { amount: 1n, scale } }))
      .toThrow("[Money] Rate is invalid.");
  });

  test("throws for unknown currency codes", () => {
    // @ts-expect-error deliberately using unknown currency code
    expect(() => fxRate({ from: "XXX", to: USD, rate: 1 })).toThrow(
      "[Money] Unknown currency code: XXX",
    );
  });

  test("throws for incompatible bases", () => {
    expect(() => fxRate({ from: EUR, to: MGA, rate: 1 })).toThrow(
      "[Money] Bases are not compatible.",
    );
  });

  test.each([
    "21/10/2026",
    "2026-02-30",
    "2026-13-01",
    "2026-10-21T14:03:12",
    "2026-10-21T25:00Z",
    "",
  ])("throws for invalid date %j", (quotedAt) => {
    expect(() => fxRate({ from: EUR, to: USD, rate: 1, context: { quotedAt } }))
      .toThrow("[Money] Date is invalid");
  });

  test("accepts a calendar date and a date-time with offset", () => {
    expect(() =>
      fxRate({
        from: EUR,
        to: USD,
        rate: 1,
        context: {
          validFrom: "2026-10-21",
          validUntil: "2026-10-21T00:00:01Z",
        },
      })
    ).not.toThrow();
  });

  test.each([
    ["2026-10-22", "2026-10-21"],
    ["2026-10-21T00:00:00Z", "2026-10-21"],
  ])(
    "throws when validFrom %s is not before validUntil %s",
    (validFrom, validUntil) => {
      expect(() =>
        fxRate({
          from: EUR,
          to: USD,
          rate: 1,
          context: { validFrom, validUntil },
        })
      ).toThrow("[Money] Validity window is invalid");
    },
  );
});
