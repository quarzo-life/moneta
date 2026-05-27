import { assertEquals } from "@std/assert";
import { EUR, MGA, USD } from "currencies/index.ts";
import { haveSameCurrency, money } from "mod";

Deno.test("haveSameCurrency", async (t) => {
  await t.step("two objects with the same currency", () => {
    const d1 = money({ amount: 500n, currency: USD });
    const d2 = money({ amount: 800n, currency: USD });

    assertEquals(haveSameCurrency([d1, d2]), true);
  });

  await t.step("two objects with different currencies", () => {
    const d1 = money({ amount: 500n, currency: USD });
    const d2 = money({ amount: 500n, currency: EUR });

    assertEquals(haveSameCurrency([d1, d2]), false);
  });

  await t.step("two objects with the same non-decimal currency", () => {
    const d1 = money({ amount: 5n, currency: MGA });
    const d2 = money({ amount: 8n, currency: MGA });

    assertEquals(haveSameCurrency([d1, d2]), true);
  });

  await t.step("decimal vs non-decimal currency", () => {
    const d1 = money({ amount: 500n, currency: USD });
    const d2 = money({ amount: 5n, currency: MGA });

    assertEquals(haveSameCurrency([d1, d2]), false);
  });

  await t.step("more than two objects, all same currency", () => {
    const d1 = money({ amount: 500n, currency: USD });
    const d2 = money({ amount: 800n, currency: USD });
    const d3 = money({ amount: 1000n, currency: USD });

    assertEquals(haveSameCurrency([d1, d2, d3]), true);
  });

  await t.step("more than two objects, one differs", () => {
    const d1 = money({ amount: 500n, currency: USD });
    const d2 = money({ amount: 800n, currency: USD });
    const d3 = money({ amount: 1000n, currency: EUR });

    assertEquals(haveSameCurrency([d1, d2, d3]), false);
  });
});
