import { assertEquals, assertThrows } from "@std/assert";
import { EUR, MGA, USD } from "../../currencies/index.ts";
import { lessThan, money } from "../../../mod.ts";

Deno.test("lessThan - bigint", async (t) => {
  await t.step("lessThan - bigint (decimal currencies: less than)", () => {
    const d1 = money({ amount: 500n, currency: USD });
    const d2 = money({ amount: 800n, currency: USD });

    assertEquals(lessThan(d1, d2), true);
  });

  await t.step("lessThan - bigint (decimal currencies: equal)", () => {
    const d1 = money({ amount: 500n, currency: USD });
    const d2 = money({ amount: 500n, currency: USD });

    assertEquals(lessThan(d1, d2), false);
  });

  await t.step("lessThan - bigint (decimal currencies: greater than)", () => {
    const d1 = money({ amount: 800n, currency: USD });
    const d2 = money({ amount: 500n, currency: USD });

    assertEquals(lessThan(d1, d2), false);
  });

  await t.step(
    "lessThan - bigint (decimal currencies: normalize scale)",
    () => {
      const d1 = money({ amount: 800n, currency: USD });
      const d2 = money({ amount: 5000n, currency: USD, scale: 3 });

      assertEquals(lessThan(d1, d2), false);
    },
  );

  await t.step(
    "lessThan - bigint (decimal currencies: different currency)",
    () => {
      const d1 = money({ amount: 800n, currency: USD });
      const d2 = money({ amount: 500n, currency: EUR });

      assertThrows(
        () => lessThan(d1, d2),
        Error,
        "[Money] Objects must have the same currency.",
      );
    },
  );

  await t.step("lessThan - bigint (non-decimal currencies: less than)", () => {
    const d1 = money({ amount: 5n, currency: MGA });
    const d2 = money({ amount: 8n, currency: MGA });

    assertEquals(lessThan(d1, d2), true);
  });

  await t.step("lessThan - bigint (non-decimal currencies: equal)", () => {
    const d1 = money({ amount: 5n, currency: MGA });
    const d2 = money({ amount: 5n, currency: MGA });

    assertEquals(lessThan(d1, d2), false);
  });

  await t.step(
    "lessThan - bigint (non-decimal currencies: greater than)",
    () => {
      const d1 = money({ amount: 8n, currency: MGA });
      const d2 = money({ amount: 5n, currency: MGA });

      assertEquals(lessThan(d1, d2), false);
    },
  );

  await t.step(
    "lessThan - bigint (non-decimal currencies: normalize scale)",
    () => {
      const d1 = money({ amount: 8n, currency: MGA });
      const d2 = money({ amount: 25n, currency: MGA, scale: 2 });

      assertEquals(lessThan(d1, d2), false);
    },
  );

  await t.step(
    "lessThan - bigint (non-decimal currencies: different currency)",
    () => {
      const d1 = money({ amount: 500n, currency: USD });
      const d2 = money({ amount: 500n, currency: MGA });

      assertThrows(
        () => lessThan(d1, d2),
        Error,
        "[Money] Objects must have the same currency.",
      );
    },
  );
});
