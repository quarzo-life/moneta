import { assertEquals, assertThrows } from "@std/assert";
import { EUR, USD } from "currencies/index.ts";
import { money } from "mod";
import { compareAmounts } from "api/comparisons/compareAmounts.ts";

Deno.test("compareAmounts", async (t) => {
  await t.step("compares monetary values with the given predicate", () => {
    const greater = money({ amount: 800n, currency: USD });
    const lesser = money({ amount: 500n, currency: USD });

    assertEquals(compareAmounts(greater, lesser, (a, b) => a > b), true);
    assertEquals(compareAmounts(lesser, greater, (a, b) => a > b), false);
    assertEquals(compareAmounts(greater, greater, (a, b) => a === b), true);
  });

  await t.step(
    "treats values equal across different scales as equal",
    () => {
      const highScale = money({ amount: 8000n, currency: USD, scale: 2 });
      const lowScale = money({ amount: 80n, currency: USD, scale: 0 });

      assertEquals(
        compareAmounts(highScale, lowScale, (a, b) => a === b),
        true,
      );
    },
  );

  await t.step("throws when currencies differ", () => {
    const d1 = money({ amount: 500n, currency: USD });
    const d2 = money({ amount: 500n, currency: EUR });

    assertThrows(
      () => compareAmounts(d1, d2, (a, b) => a > b),
      Error,
      "[Money] Objects must have the same currency.",
    );
  });
});
