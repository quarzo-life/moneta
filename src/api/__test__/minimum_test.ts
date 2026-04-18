import { assertEquals, assertThrows } from "@std/assert";
import { EUR, USD } from "../../currencies/index.ts";
import { minimum, money, toSnapshot } from "../../../mod.ts";

Deno.test("minimum - bigint", async (t) => {
  await t.step("minimum - bigint (returns smallest)", () => {
    const d1 = money({ amount: 150n, currency: USD });
    const d2 = money({ amount: 50n, currency: USD });

    const snapshot = toSnapshot(minimum([d1, d2]));

    assertEquals(snapshot, {
      amount: 50n,
      currency: USD,
      scale: 2,
    });
  });

  await t.step("minimum - bigint (after normalization)", () => {
    const d1 = money({ amount: 500n, currency: USD });
    const d2 = money({ amount: 1000n, currency: USD, scale: 3 });

    const snapshot = toSnapshot(minimum([d1, d2]));

    assertEquals(snapshot, {
      amount: 1000n,
      currency: USD,
      scale: 3,
    });
  });

  await t.step("minimum - bigint (different currencies)", () => {
    const d1 = money({ amount: 150n, currency: USD });
    const d2 = money({ amount: 50n, currency: EUR });

    assertThrows(
      () => minimum([d1, d2]),
      Error,
      "[Money] Objects must have the same currency.",
    );
  });
});
