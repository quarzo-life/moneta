import { assertEquals, assertThrows } from "@std/assert";
import { EUR, USD } from "../../currencies/index.ts";
import { add, money, toSnapshot } from "../../../mod.ts";

Deno.test("add - number", async (t) => {
  await t.step("add - number (decimal currencies)", () => {
    const d1 = money({ amount: 500n, currency: USD });
    const d2 = money({ amount: 100n, currency: USD });

    const snapshot = toSnapshot(add(d1, d2));
    assertEquals(snapshot, { amount: 600n, currency: USD, scale: 2 });
  });

  await t.step("add - number (negative values)", () => {
    const d1 = money({ amount: -500n, currency: USD });
    const d2 = money({ amount: -100n, currency: USD });

    const snapshot = toSnapshot(add(d1, d2));
    assertEquals(snapshot, { amount: -600n, currency: USD, scale: 2 });
  });

  await t.step("add - number (normalizing scale)", () => {
    const d1 = money({ amount: 500n, currency: USD });
    const d2 = money({ amount: 1000n, currency: USD, scale: 3 });

    const snapshot = toSnapshot(add(d1, d2));
    assertEquals(snapshot, { amount: 6000n, currency: USD, scale: 3 });
  });

  await t.step("add - number (different currencies)", () => {
    const d1 = money({ amount: 500n, currency: USD });
    const d2 = money({ amount: 100n, currency: EUR });

    assertThrows(
      () => add(d1, d2),
      Error,
      "[Money] Objects must have the same currency.",
    );
  });
});
