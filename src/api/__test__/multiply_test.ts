import { assertEquals } from "@std/assert";
import { USD } from "../../currencies/index.ts";
import { multiply, toSnapshot } from "../index.ts";
import { Money } from "../../../mod.ts";

// Number tests
Deno.test("multiply - number: multiplies positive Money objects", () => {
  const d = new Money({ amount: 400n, currency: USD });

  assertEquals(toSnapshot(multiply(d, 4)), {
    amount: 1600n,
    scale: 2,
    currency: USD,
  });
  assertEquals(toSnapshot(multiply(d, -1)), {
    amount: -400n,
    scale: 2,
    currency: USD,
  });
});

Deno.test("multiply - number: multiplies negative Money objects", () => {
  const d = new Money({ amount: -400n, currency: USD });

  assertEquals(toSnapshot(multiply(d, 4)), {
    amount: -1600n,
    scale: 2,
    currency: USD,
  });
  assertEquals(toSnapshot(multiply(d, 1)), {
    amount: -400n,
    scale: 2,
    currency: USD,
  });
});

Deno.test("multiply - number: converts multiplied amount to safest scale", () => {
  const d = new Money({ amount: 401n, currency: USD });

  const snapshot = toSnapshot(multiply(d, { amount: 2001n, scale: 3 }));
  assertEquals(snapshot, {
    amount: 802401n,
    scale: 5,
    currency: USD,
  });
});
