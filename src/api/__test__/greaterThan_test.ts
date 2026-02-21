import { assertEquals, assertThrows } from "@std/assert";
import { EUR, MGA, USD } from "../../currencies/index.ts";
import { greaterThan, Money } from "../../../mod.ts";

Deno.test("greaterThan - bigint", async (t) => {
  await t.step("greaterThan - bigint (decimal currencies: less than)", () => {
    const d1 = new Money({ amount: 500n, currency: USD });
    const d2 = new Money({ amount: 800n, currency: USD });

    assertEquals(greaterThan(d1, d2), false);
  });

  await t.step("greaterThan - bigint (decimal currencies: equal)", () => {
    const d1 = new Money({ amount: 500n, currency: USD });
    const d2 = new Money({ amount: 500n, currency: USD });

    assertEquals(greaterThan(d1, d2), false);
  });

  await t.step(
    "greaterThan - bigint (decimal currencies: greater than)",
    () => {
      const d1 = new Money({ amount: 800n, currency: USD });
      const d2 = new Money({ amount: 500n, currency: USD });

      assertEquals(greaterThan(d1, d2), true);
    },
  );

  await t.step(
    "greaterThan - bigint (decimal currencies: normalize scale)",
    () => {
      const d1 = new Money({ amount: 800n, currency: USD });
      const d2 = new Money({ amount: 5000n, currency: USD, scale: 3 });

      assertEquals(greaterThan(d1, d2), true);
    },
  );

  await t.step(
    "greaterThan - bigint (decimal currencies: different currency)",
    () => {
      const d1 = new Money({ amount: 800n, currency: USD });
      const d2 = new Money({ amount: 500n, currency: EUR });

      assertThrows(
        () => greaterThan(d1, d2),
        Error,
        "[Money] Objects must have the same currency.",
      );
    },
  );

  await t.step(
    "greaterThan - bigint (non-decimal currencies: less than)",
    () => {
      const d1 = new Money({ amount: 5n, currency: MGA });
      const d2 = new Money({ amount: 8n, currency: MGA });

      assertEquals(greaterThan(d1, d2), false);
    },
  );

  await t.step("greaterThan - bigint (non-decimal currencies: equal)", () => {
    const d1 = new Money({ amount: 5n, currency: MGA });
    const d2 = new Money({ amount: 5n, currency: MGA });

    assertEquals(greaterThan(d1, d2), false);
  });

  await t.step(
    "greaterThan - bigint (non-decimal currencies: greater than)",
    () => {
      const d1 = new Money({ amount: 8n, currency: MGA });
      const d2 = new Money({ amount: 5n, currency: MGA });

      assertEquals(greaterThan(d1, d2), true);
    },
  );

  await t.step(
    "greaterThan - bigint (non-decimal currencies: normalize scale)",
    () => {
      const d1 = new Money({ amount: 8n, currency: MGA });
      const d2 = new Money({ amount: 25n, currency: MGA, scale: 2 });

      assertEquals(greaterThan(d1, d2), true);
    },
  );

  await t.step(
    "greaterThan - bigint (non-decimal currencies: different currency)",
    () => {
      const d1 = new Money({ amount: 500n, currency: USD });
      const d2 = new Money({ amount: 500n, currency: MGA });

      assertThrows(
        () => greaterThan(d1, d2),
        Error,
        "[Money] Objects must have the same currency.",
      );
    },
  );
});
