import { assertEquals } from "@std/assert";
import { EUR, MGA, USD } from "../../currencies/index.ts";
import { equal, money } from "../../../mod.ts";

Deno.test("equal - bigint", async (t) => {
  await t.step("equal - bigint (decimal currencies)", () => {
    const d1 = money({ amount: 500n, currency: USD });
    const d2 = money({ amount: 500n, currency: USD });

    assertEquals(equal(d1, d2), true);
  });

  await t.step("equal - bigint (different amounts)", () => {
    const d1 = money({ amount: 500n, currency: USD });
    const d2 = money({ amount: 800n, currency: USD });

    assertEquals(equal(d1, d2), false);
  });

  await t.step("equal - bigint (different currencies)", () => {
    const d1 = money({ amount: 500n, currency: USD });
    const d2 = money({ amount: 500n, currency: EUR });

    assertEquals(equal(d1, d2), false);
  });

  await t.step("equal - bigint (different amounts and currencies)", () => {
    const d1 = money({ amount: 500n, currency: USD });
    const d2 = money({ amount: 800n, currency: EUR });

    assertEquals(equal(d1, d2), false);
  });

  await t.step("equal - bigint (same amount after normalization)", () => {
    const d1 = money({ amount: 500n, currency: USD });
    const d2 = money({ amount: 5000n, currency: USD, scale: 3 });

    assertEquals(equal(d1, d2), true);
  });

  await t.step("equal - bigint (different amount after normalization)", () => {
    const d1 = money({ amount: 500n, currency: USD });
    const d2 = money({ amount: 500n, currency: USD, scale: 3 });

    assertEquals(equal(d1, d2), false);
  });

  await t.step("equal - bigint (non-decimal currencies)", () => {
    const d1 = money({ amount: 5n, currency: MGA });
    const d2 = money({ amount: 5n, currency: MGA });

    assertEquals(equal(d1, d2), true);
  });

  await t.step("equal - bigint (non-decimal different amounts)", () => {
    const d1 = money({ amount: 5n, currency: MGA });
    const d2 = money({ amount: 8n, currency: MGA });

    assertEquals(equal(d1, d2), false);
  });

  await t.step("equal - bigint (non-decimal different currencies)", () => {
    const d1 = money({ amount: 500n, currency: USD });
    const d2 = money({ amount: 500n, currency: MGA });

    assertEquals(equal(d1, d2), false);
  });

  await t.step(
    "equal - bigint (non-decimal different amount and currency)",
    () => {
      const d1 = money({ amount: 500n, currency: USD });
      const d2 = money({ amount: 8n, currency: MGA });

      assertEquals(equal(d1, d2), false);
    },
  );

  await t.step(
    "equal - bigint (non-decimal same amount after normalization)",
    () => {
      const d1 = money({ amount: 5n, currency: MGA });
      const d2 = money({ amount: 25n, currency: MGA, scale: 2 });

      assertEquals(equal(d1, d2), true);
    },
  );

  await t.step(
    "equal - bigint (non-decimal different amount after normalization)",
    () => {
      const d1 = money({ amount: 25n, currency: MGA });
      const d2 = money({ amount: 25n, currency: MGA, scale: 2 });

      assertEquals(equal(d1, d2), false);
    },
  );
});
