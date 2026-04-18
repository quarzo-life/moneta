import { assertEquals } from "@std/assert";
import { hasSubUnits, MGA, money, USD } from "../../../mod.ts";

Deno.test("hasSubUnits - decimal currencies", async (t) => {
  await t.step("returns false when there are no sub-units", () => {
    const d = money({ amount: 1100n, currency: USD });

    assertEquals(hasSubUnits(d), false);
  });

  await t.step(
    "returns true when there are sub-units based on a custom scale",
    () => {
      const d = money({ amount: 1100n, currency: USD, scale: 3 });

      assertEquals(hasSubUnits(d), true);
    },
  );

  await t.step("returns true when there are sub-units", () => {
    const d = money({ amount: 1150n, currency: USD });

    assertEquals(hasSubUnits(d), true);
  });

  await t.step(
    "returns false when there are no sub-units based on a custom scale",
    () => {
      const d = money({ amount: 1150n, currency: USD, scale: 1 });

      assertEquals(hasSubUnits(d), false);
    },
  );
});

Deno.test("hasSubUnits - non-decimal currencies", async (t) => {
  const GBP = { code: "GBP", base: [20, 12], exponent: 1 };

  await t.step("returns false when there are no sub-units", () => {
    const d = money({ amount: 10n, currency: MGA });

    assertEquals(hasSubUnits(d), false);
  });

  await t.step("returns true when there are sub-units", () => {
    const d = money({ amount: 11n, currency: MGA });

    assertEquals(hasSubUnits(d), true);
  });

  await t.step(
    "returns false when there are no sub-units based on a multi-base",
    () => {
      const d = money({ amount: 240n, currency: GBP });

      assertEquals(hasSubUnits(d), false);
    },
  );
});
