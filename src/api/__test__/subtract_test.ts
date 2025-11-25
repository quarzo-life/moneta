import { assertEquals, assertThrows } from "@std/assert";
import { EUR, USD } from "../../currencies/index.ts";
import { Money, subtract, toSnapshot } from "../../../mod.ts";

Deno.test("subtract - number", async (t) => {
  await t.step("subtracts positive Money objects", () => {
    const d1 = new Money({ amount: 500n, currency: USD });
    const d2 = new Money({ amount: 100n, currency: USD });

    const snapshot = toSnapshot(subtract(d1, d2));

    assertEquals(snapshot, {
      amount: 400n,
      currency: USD,
      scale: 2,
    });
  });

  await t.step("subtracts negative Money objects", () => {
    const d1 = new Money({ amount: -500n, currency: USD });
    const d2 = new Money({ amount: -100n, currency: USD });

    const snapshot = toSnapshot(subtract(d1, d2));

    assertEquals(snapshot, {
      amount: -400n,
      currency: USD,
      scale: 2,
    });
  });

  await t.step("subtracts positive negative Money objects", () => {
    const d1 = new Money({ amount: 500n, currency: USD });
    const d2 = new Money({ amount: -100n, currency: USD });

    const snapshot = toSnapshot(subtract(d1, d2));

    assertEquals(snapshot, {
      amount: 600n,
      currency: USD,
      scale: 2,
    });
  });

  await t.step("normalizes the result to the highest scale", () => {
    const d1 = new Money({ amount: 500n, currency: USD });
    const d2 = new Money({ amount: 1000n, currency: USD, scale: 3 });

    const snapshot = toSnapshot(subtract(d1, d2));

    assertEquals(snapshot, {
      amount: 4000n,
      currency: USD,
      scale: 3,
    });
  });

  await t.step("throws when using different currencies", () => {
    const d1 = new Money({ amount: 500n, currency: USD });
    const d2 = new Money({ amount: 100n, currency: EUR });

    assertThrows(
      () => subtract(d1, d2),
      Error,
      "[Money] Objects must have the same currency.",
    );
  });
});
