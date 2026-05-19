import { assertEquals } from "@std/assert";
import { JPY, USD } from "currencies/index.ts";
import { dangerRound, toSnapshot } from "api/index.ts";
import { money } from "mod";
import { down, halfUp, up } from "divide/index.ts";

Deno.test("dangerRound - rounds to currency exponent - down", () => {
  const m = money({ amount: 12345n, currency: USD, scale: 3 }); // $12.345

  assertEquals(toSnapshot(dangerRound(m, down)), {
    amount: 1234n,
    currency: USD,
    scale: 2,
  });
});

Deno.test("dangerRound - rounds to currency exponent - up", () => {
  const m = money({ amount: 12345n, currency: USD, scale: 3 }); // $12.345

  assertEquals(toSnapshot(dangerRound(m, up)), {
    amount: 1235n,
    currency: USD,
    scale: 2,
  });
});

Deno.test("dangerRound - rounds to currency exponent - halfUp", () => {
  // $12.345 → nearest cent halfUp → $12.35
  const m = money({ amount: 12345n, currency: USD, scale: 3 });

  assertEquals(toSnapshot(dangerRound(m, halfUp)), {
    amount: 1235n,
    currency: USD,
    scale: 2,
  });
});

Deno.test("dangerRound - no-op when scale equals exponent", () => {
  const m = money({ amount: 1000n, currency: USD, scale: 2 });
  const result = dangerRound(m, down);

  assertEquals(result, m);
});

Deno.test("dangerRound - no-op when scale is below exponent", () => {
  const m = money({ amount: 100n, currency: USD, scale: 1 }); // $10.0 (scale < exponent 2)
  const result = dangerRound(m, down);

  assertEquals(result, m);
});

Deno.test("dangerRound - JPY (exponent 0) - rounds down", () => {
  const m = money({ amount: 12345n, currency: JPY, scale: 2 }); // ¥123.45

  assertEquals(toSnapshot(dangerRound(m, down)), {
    amount: 123n,
    currency: JPY,
    scale: 0,
  });
});

Deno.test("dangerRound - JPY (exponent 0) - rounds up", () => {
  const m = money({ amount: 12345n, currency: JPY, scale: 2 }); // ¥123.45

  assertEquals(toSnapshot(dangerRound(m, up)), {
    amount: 124n,
    currency: JPY,
    scale: 0,
  });
});

Deno.test("dangerRound - JPY (exponent 0) - no-op when already at scale 0", () => {
  const m = money({ amount: 123n, currency: JPY });
  const result = dangerRound(m, down);

  assertEquals(result, m);
});

Deno.test("dangerRound - large sub-unit scale reduces correctly", () => {
  // $1.23456 (scale 5) → $1.23 (scale 2) with down
  const m = money({ amount: 123456n, currency: USD, scale: 5 });

  assertEquals(toSnapshot(dangerRound(m, down)), {
    amount: 123n,
    currency: USD,
    scale: 2,
  });
});
