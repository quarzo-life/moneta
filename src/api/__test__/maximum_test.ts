import { assertEquals, assertThrows } from "@std/assert";
import { EUR, USD } from "../../currencies/index.ts";
import { maximum, Money, toSnapshot } from "../../../mod.ts";

Deno.test("maximum - bigint", async (t) => {
  await t.step("maximum - bigint (returns greatest)", () => {
    const d1 = new Money({ amount: 150n, currency: USD });
    const d2 = new Money({ amount: 50n, currency: USD });

    const snapshot = toSnapshot(maximum([d1, d2]));

    assertEquals(snapshot, {
      amount: 150n,
      currency: USD,
      scale: 2,
    });
  });

  await t.step("maximum - bigint (after normalization)", () => {
    const d1 = new Money({ amount: 500n, currency: USD });
    const d2 = new Money({ amount: 1000n, currency: USD, scale: 3 });

    const snapshot = toSnapshot(maximum([d1, d2]));

    assertEquals(snapshot, {
      amount: 5000n,
      currency: USD,
      scale: 3,
    });
  });

  await t.step("maximum - bigint (different currencies)", () => {
    const d1 = new Money({ amount: 150n, currency: USD });
    const d2 = new Money({ amount: 50n, currency: EUR });

    assertThrows(
      () => maximum([d1, d2]),
      Error,
      "[Money] Objects must have the same currency.",
    );
  });
});
