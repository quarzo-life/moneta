import { assertEquals } from "@std/assert/equals";
import { assertStrictEquals } from "@std/assert/strict-equals";
import { assertThrows } from "@std/assert/throws";
import { EUR } from "../currencies/index.ts";
import { Money } from "./index.ts";

Deno.test("Money constructor respects bigint amounts and currency scale", () => {
  const amount = 500n;
  const money = new Money({ amount, currency: EUR });

  assertStrictEquals(money.amount, amount);
  assertStrictEquals(money.currency.code, EUR.code);
  assertStrictEquals(money.scale, EUR.exponent);
});

Deno.test("Money constructor throws when currency does not exist", () => {
  assertThrows(
    () => {
      // @ts-expect-error deliberately using unknown currency code
      new Money({ amount: 124n, currency: "DOES NOT EXIST" });
    },
    Error,
    "[Money] Unknown currency code: DOES NOT EXIST",
  );
});

Deno.test("Money constructor handles string amounts with 'n' suffix", () => {
  const money = new Money({ amount: "1234n", currency: EUR });
  assertStrictEquals(money.amount, 1234n);
});

Deno.test("Money constructor throws for unsafe integers", () => {
  assertThrows(
    () => {
      // 2^53 is the limit for safe integers in JS
      new Money({ amount: 9007199254740992, currency: EUR });
    },
    Error,
    "[Money] Amount is not a safe integer; use bigint or string",
  );
});

Deno.test("Money constructor throws for non-integer numbers", () => {
  assertThrows(
    () => {
      // Logic from index.ts prevents decimals as numbers to avoid precision loss
      new Money({ amount: 12.34, currency: EUR });
    },
    Error,
    "[Money] Amount is not a safe integer; use bigint or string",
  );
});

Deno.test("Money constructor respects custom scale", () => {
  const customScale = 4;
  const money = new Money({ amount: 100n, currency: EUR, scale: customScale });

  assertStrictEquals(money.scale, customScale);
});

Deno.test("Money serialization (toJSON) converts bigint to string", () => {
  const money = new Money({ amount: 5000n, currency: EUR });
  const json = money.toJSON();

  // Based on your index.ts implementation which appends "n"
  assertEquals(json, {
    amount: "5000n",
    currency: "EUR",
    scale: 2,
  });
});

Deno.test("Money constructor recovers state from JSON-like object", () => {
  const data = { amount: "1000n", currency: "EUR" as const, scale: 2 };
  const money = new Money(data);

  assertStrictEquals(money.amount, 1000n);
  assertStrictEquals(money.currency.code, "EUR");
});

Deno.test("Money constructor throws descriptive error for negative scale", () => {
  assertThrows(
    () => new Money({ amount: 100n, currency: EUR, scale: -5 }),
    Error,
    "[Money] Scale must be a non-negative integer, but received: -5",
  );
});

Deno.test("Money constructor throws descriptive error for non-integer scale", () => {
  assertThrows(
    () => new Money({ amount: 100n, currency: EUR, scale: 2.75 }),
    Error,
    "[Money] Scale must be an integer, but received: 2.75",
  );
});
