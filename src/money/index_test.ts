import { expect, test } from "vitest";
import { EUR } from "currencies/index.ts";
import { money, zeroMoney } from "./index.ts";

test("money factory respects bigint amounts and currency scale", () => {
  const amount = 500n;
  const m = money({ amount, currency: EUR });

  expect(m.amount).toBe(amount);
  expect(m.currency.code).toBe(EUR.code);
  expect(m.scale).toBe(EUR.exponent);
});

test("money factory throws when currency does not exist", () => {
  expect(() => {
    // @ts-expect-error deliberately using unknown currency code
    money({ amount: 124n, currency: "DOES NOT EXIST" });
  }).toThrow("[Money] Unknown currency code: DOES NOT EXIST");
});

test("money factory handles string amounts with 'n' suffix", () => {
  const m = money({ amount: "1234n", currency: EUR });
  expect(m.amount).toBe(1234n);
});

test("money factory throws for unsafe integers", () => {
  expect(() => {
    // 2^53 is the limit for safe integers in JS
    money({ amount: 9007199254740992, currency: EUR });
  }).toThrow("[Money] Amount is not a safe integer; use bigint or string");
});

test("money factory throws for non-integer numbers", () => {
  expect(() => {
    // Logic from index.ts prevents decimals as numbers to avoid precision loss
    money({ amount: 12.34, currency: EUR });
  }).toThrow("[Money] Amount is not a safe integer; use bigint or string");
});

test("money factory throws for non-integer string", () => {
  const amount = "12.34";
  expect(() => {
    // Logic from index.ts prevents decimals as numbers to avoid precision loss
    money({ amount, currency: EUR });
  }).toThrow(`[Money] Invalid string amount: ${amount}`);
});

test("money factory throws for non-integer string with comma", () => {
  const amount = "12,34";
  expect(() => {
    // Logic from index.ts prevents decimals as numbers to avoid precision loss
    money({ amount, currency: EUR });
  }).toThrow(`[Money] Invalid string amount: ${amount}`);
});

test("money factory respects custom scale", () => {
  const customScale = 4;
  const m = money({ amount: 100n, currency: EUR, scale: customScale });

  expect(m.scale).toBe(customScale);
});

test("Money serialization (toJSON) converts bigint to string", () => {
  const m = money({ amount: 5000n, currency: EUR });
  const json = m.toJSON();

  expect(json).toEqual({
    amount: "5000n",
    currency: "EUR",
    scale: 2,
  });
});

test("Money serialization (JSON.stringify) calls toJSON implicitly", () => {
  const m = money({ amount: 5000n, currency: EUR });
  const json = JSON.stringify(m);

  expect(json).toEqual('{"amount":"5000n","currency":"EUR","scale":2}');
});

test("money factory recovers state from JSON-like object", () => {
  const data = { amount: "1000n", currency: "EUR" as const, scale: 2 };
  const m = money(data);

  expect(m.amount).toBe(1000n);
  expect(m.currency.code).toBe("EUR");
});

test("Money zero object", () => {
  const zeroEUR = zeroMoney(EUR);

  expect(zeroEUR.amount).toBe(0n);
  expect(zeroEUR.currency.code).toBe("EUR");
});

test("money factory throws descriptive error for negative scale", () => {
  expect(() => money({ amount: 100n, currency: EUR, scale: -5 })).toThrow(
    "[Money] Scale must be a non-negative integer, but received: -5",
  );
});

test("money factory throws descriptive error for non-integer scale", () => {
  expect(() => money({ amount: 100n, currency: EUR, scale: 2.75 })).toThrow(
    "[Money] Scale must be an integer, but received: 2.75",
  );
});
