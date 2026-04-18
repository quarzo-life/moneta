import { assertEquals } from "@std/assert/equals";
import { assertStrictEquals } from "@std/assert/strict-equals";
import { assertThrows } from "@std/assert/throws";
import { EUR } from "../currencies/index.ts";
import { money, zeroMoney } from "./index.ts";

Deno.test("money factory respects bigint amounts and currency scale", () => {
  const amount = 500n;
  const m = money({ amount, currency: EUR });

  assertStrictEquals(m.amount, amount);
  assertStrictEquals(m.currency.code, EUR.code);
  assertStrictEquals(m.scale, EUR.exponent);
});

Deno.test("money factory throws when currency does not exist", () => {
  assertThrows(
    () => {
      // @ts-expect-error deliberately using unknown currency code
      money({ amount: 124n, currency: "DOES NOT EXIST" });
    },
    Error,
    "[Money] Unknown currency code: DOES NOT EXIST",
  );
});

Deno.test("money factory handles string amounts with 'n' suffix", () => {
  const m = money({ amount: "1234n", currency: EUR });
  assertStrictEquals(m.amount, 1234n);
});

Deno.test("money factory throws for unsafe integers", () => {
  assertThrows(
    () => {
      // 2^53 is the limit for safe integers in JS
      money({ amount: 9007199254740992, currency: EUR });
    },
    Error,
    "[Money] Amount is not a safe integer; use bigint or string",
  );
});

Deno.test("money factory throws for non-integer numbers", () => {
  assertThrows(
    () => {
      // Logic from index.ts prevents decimals as numbers to avoid precision loss
      money({ amount: 12.34, currency: EUR });
    },
    Error,
    "[Money] Amount is not a safe integer; use bigint or string",
  );
});

Deno.test("money factory throws for non-integer string", () => {
  const amount = "12.34";
  assertThrows(
    () => {
      // Logic from index.ts prevents decimals as numbers to avoid precision loss
      money({ amount, currency: EUR });
    },
    Error,
    `[Money] Invalid string amount: ${amount}`,
  );
});

Deno.test("money factory throws for non-integer string with comma", () => {
  const amount = "12,34";
  assertThrows(
    () => {
      // Logic from index.ts prevents decimals as numbers to avoid precision loss
      money({ amount, currency: EUR });
    },
    Error,
    `[Money] Invalid string amount: ${amount}`,
  );
});

Deno.test("money factory respects custom scale", () => {
  const customScale = 4;
  const m = money({ amount: 100n, currency: EUR, scale: customScale });

  assertStrictEquals(m.scale, customScale);
});

Deno.test("Money serialization (toJSON) converts bigint to string", () => {
  const m = money({ amount: 5000n, currency: EUR });
  const json = m.toJSON();

  assertEquals(json, {
    amount: "5000n",
    currency: "EUR",
    scale: 2,
  });
});

Deno.test("Money serialization (JSON.stringify) calls toJSON implicitly", () => {
  const m = money({ amount: 5000n, currency: EUR });
  const json = JSON.stringify(m);

  assertEquals(json, '{"amount":"5000n","currency":"EUR","scale":2}');
});

Deno.test("money factory recovers state from JSON-like object", () => {
  const data = { amount: "1000n", currency: "EUR" as const, scale: 2 };
  const m = money(data);

  assertStrictEquals(m.amount, 1000n);
  assertStrictEquals(m.currency.code, "EUR");
});

Deno.test("Money zero object", () => {
  const zeroEUR = zeroMoney(EUR);

  assertStrictEquals(zeroEUR.amount, 0n);
  assertStrictEquals(zeroEUR.currency.code, "EUR");
});

Deno.test("money factory throws descriptive error for negative scale", () => {
  assertThrows(
    () => money({ amount: 100n, currency: EUR, scale: -5 }),
    Error,
    "[Money] Scale must be a non-negative integer, but received: -5",
  );
});

Deno.test("money factory throws descriptive error for non-integer scale", () => {
  assertThrows(
    () => money({ amount: 100n, currency: EUR, scale: 2.75 }),
    Error,
    "[Money] Scale must be an integer, but received: 2.75",
  );
});
