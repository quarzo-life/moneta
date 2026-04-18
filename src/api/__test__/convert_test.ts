import { assertEquals, assertThrows } from "@std/assert";
import { EUR, JPY, MGA } from "../../currencies/index.ts";
import { convert, money, toSnapshot } from "../../../mod.ts";

Deno.test("convert - market rate string", async (t) => {
  await t.step("converts using a comma decimal rate", () => {
    const d = money({ amount: 1000n, currency: EUR });

    const snapshot = toSnapshot(
      convert(d, { from: EUR, to: JPY, rate: { amount: 1826818n, scale: 4 } }),
    );

    assertEquals(snapshot, {
      amount: 1827n,
      scale: 0,
      currency: JPY,
    });
  });

  await t.step("expands scale to target exponent when needed", () => {
    const d = money({ amount: 100n, currency: JPY });

    const snapshot = toSnapshot(
      convert(d, { from: JPY, to: EUR, rate: 1 }),
    );

    assertEquals(snapshot, {
      amount: 10000n,
      scale: 2,
      currency: EUR,
    });
  });
});

Deno.test("convert - incompatible bases", () => {
  const d = money({ amount: 100n, currency: EUR });

  assertThrows(
    () => convert(d, { from: EUR, to: MGA, rate: 1 }),
    Error,
    "[Money] Bases are not compatible.",
  );
});
