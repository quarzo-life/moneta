import { assertEquals } from "@std/assert";
import { MGA, USD } from "currencies/index.ts";
import { haveSameAmount, money } from "mod";

Deno.test("haveSameAmount", async (t) => {
  await t.step("two objects with the same amount", () => {
    const d1 = money({ amount: 500n, currency: USD });
    const d2 = money({ amount: 500n, currency: USD });

    assertEquals(haveSameAmount([d1, d2]), true);
  });

  await t.step("two objects with different amounts", () => {
    const d1 = money({ amount: 500n, currency: USD });
    const d2 = money({ amount: 800n, currency: USD });

    assertEquals(haveSameAmount([d1, d2]), false);
  });

  await t.step("two objects with the same amount after normalization", () => {
    const d1 = money({ amount: 500n, currency: USD });
    const d2 = money({ amount: 5000n, currency: USD, scale: 3 });

    assertEquals(haveSameAmount([d1, d2]), true);
  });

  await t.step(
    "two objects with different amounts after normalization",
    () => {
      const d1 = money({ amount: 500n, currency: USD });
      const d2 = money({ amount: 500n, currency: USD, scale: 3 });

      assertEquals(haveSameAmount([d1, d2]), false);
    },
  );

  await t.step("non-decimal currency, same amount", () => {
    const d1 = money({ amount: 5n, currency: MGA });
    const d2 = money({ amount: 25n, currency: MGA, scale: 2 });

    assertEquals(haveSameAmount([d1, d2]), true);
  });

  await t.step("more than two objects, all equal", () => {
    const d1 = money({ amount: 500n, currency: USD });
    const d2 = money({ amount: 5000n, currency: USD, scale: 3 });
    const d3 = money({ amount: 50000n, currency: USD, scale: 4 });

    assertEquals(haveSameAmount([d1, d2, d3]), true);
  });

  await t.step("more than two objects, one differs", () => {
    const d1 = money({ amount: 500n, currency: USD });
    const d2 = money({ amount: 500n, currency: USD });
    const d3 = money({ amount: 800n, currency: USD });

    assertEquals(haveSameAmount([d1, d2, d3]), false);
  });
});
