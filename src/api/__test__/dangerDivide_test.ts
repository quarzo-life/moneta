import { assertEquals } from "@std/assert";
import { JPY, MGA, USD } from "currencies/index.ts";
import { dangerDivide, toSnapshot } from "api/index.ts";
import { money } from "mod";
import { down, halfUp, up } from "divide/index.ts";

Deno.test("dangerDivide - integer divisor - exact division", () => {
  const m = money({ amount: 1000n, currency: USD });

  assertEquals(toSnapshot(dangerDivide(m, 4, down)), {
    amount: 250n,
    currency: USD,
    scale: 2,
  });
});

Deno.test("dangerDivide - integer divisor - rounds down", () => {
  const m = money({ amount: 1000n, currency: USD });

  assertEquals(toSnapshot(dangerDivide(m, 3, down)), {
    amount: 333n,
    currency: USD,
    scale: 2,
  });
});

Deno.test("dangerDivide - integer divisor - rounds up", () => {
  const m = money({ amount: 1000n, currency: USD });

  assertEquals(toSnapshot(dangerDivide(m, 3, up)), {
    amount: 334n,
    currency: USD,
    scale: 2,
  });
});

Deno.test("dangerDivide - integer divisor - rounds halfUp", () => {
  // 1000 / 3 = 333.33… → halfUp → 333
  const m = money({ amount: 1000n, currency: USD });

  assertEquals(toSnapshot(dangerDivide(m, 3, halfUp)), {
    amount: 333n,
    currency: USD,
    scale: 2,
  });
});

Deno.test("dangerDivide - bigint divisor - exact division", () => {
  const m = money({ amount: 1000n, currency: USD });

  assertEquals(toSnapshot(dangerDivide(m, 4n, down)), {
    amount: 250n,
    currency: USD,
    scale: 2,
  });
});

Deno.test("dangerDivide - scaled divisor - exact fractional division", () => {
  // 1000n / 0.5 = 2000n
  const m = money({ amount: 1000n, currency: USD });

  assertEquals(toSnapshot(dangerDivide(m, { amount: 5n, scale: 1 }, down)), {
    amount: 2000n,
    currency: USD,
    scale: 2,
  });
});

Deno.test("dangerDivide - scaled divisor - rounds down", () => {
  // 1000n / 0.3 = 3333.33… → down → 3333
  const m = money({ amount: 1000n, currency: USD });

  assertEquals(toSnapshot(dangerDivide(m, { amount: 3n, scale: 1 }, down)), {
    amount: 3333n,
    currency: USD,
    scale: 2,
  });
});

Deno.test("dangerDivide - scaled divisor - rounds up", () => {
  // 1000n / 0.3 = 3333.33… → up → 3334
  const m = money({ amount: 1000n, currency: USD });

  assertEquals(toSnapshot(dangerDivide(m, { amount: 3n, scale: 1 }, up)), {
    amount: 3334n,
    currency: USD,
    scale: 2,
  });
});

Deno.test("dangerDivide - preserves scale", () => {
  const m = money({ amount: 10000n, currency: USD, scale: 3 });

  assertEquals(toSnapshot(dangerDivide(m, 3, down)), {
    amount: 3333n,
    currency: USD,
    scale: 3,
  });
});

Deno.test("dangerDivide - non-decimal currency (MGA)", () => {
  const m = money({ amount: 100n, currency: MGA });

  assertEquals(toSnapshot(dangerDivide(m, 3, down)), {
    amount: 33n,
    currency: MGA,
    scale: 1,
  });
});

Deno.test("dangerDivide - zero-exponent currency (JPY) - exact", () => {
  const m = money({ amount: 1000n, currency: JPY });

  assertEquals(toSnapshot(dangerDivide(m, 4, down)), {
    amount: 250n,
    currency: JPY,
    scale: 0,
  });
});
