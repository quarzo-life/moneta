import { assertEquals } from "@std/assert";
import { Money, toSnapshot, trimScale, USD } from "../../../mod.ts";

Deno.test("trimScale - number - trims a Money object down to its currency exponent's scale", () => {
  const d = new Money({ amount: 500000n, currency: USD, scale: 5 });
  const snapshot = toSnapshot(trimScale(d));

  assertEquals(snapshot, { amount: 500n, currency: USD, scale: 2 });
});

Deno.test("trimScale - number - trims a Money object down to the safest possible scale", () => {
  const d = new Money({ amount: 55550n, currency: USD, scale: 4 });
  const snapshot = toSnapshot(trimScale(d));

  assertEquals(snapshot, { amount: 5555n, currency: USD, scale: 3 });
});

Deno.test("trimScale - number - doesn't trim the scale when there's nothing to trim", () => {
  const d = new Money({ amount: 5555n, currency: USD, scale: 3 });
  const snapshot = toSnapshot(trimScale(d));

  assertEquals(snapshot, { amount: 5555n, currency: USD, scale: 3 });
});

Deno.test("trimScale - number - doesn't crash on zero amounts", () => {
  const d = new Money({ amount: 0n, currency: USD });
  const snapshot = toSnapshot(trimScale(d));

  assertEquals(snapshot, { amount: 0n, scale: 2, currency: USD });
});
