import { assertEquals } from "@std/assert";
import * as fc from "npm:fast-check@4.5.3";
import { halfOdd } from "../index.ts";

Deno.test("decimal factors", async (t) => {
  await t.step("does not round with a positive integer quotient", () => {
    assertEquals(halfOdd(20n, 10n), 2n);
  });

  await t.step("does not round with a negative integer quotient", () => {
    assertEquals(halfOdd(-20n, 10n), -2n);
  });

  await t.step("does not round with a zero quotient", () => {
    assertEquals(halfOdd(0n, 10n), 0n);
  });

  await t.step(
    "rounds to nearest odd integer with a positive half quotient rounding to an even integer",
    () => {
      assertEquals(halfOdd(15n, 10n), 1n);
    },
  );

  await t.step(
    "rounds to nearest odd integer with a positive half quotient rounding to an odd integer",
    () => {
      assertEquals(halfOdd(25n, 10n), 3n);
    },
  );

  await t.step(
    "rounds to nearest odd integer with a negative half quotient",
    () => {
      assertEquals(halfOdd(-25n, 10n), -3n);
    },
  );

  await t.step("rounds up with any positive float quotient above half", () => {
    fc.assert(
      fc.property(fc.integer({ min: 6, max: 9 }), (a) => {
        assertEquals(halfOdd(BigInt(a), 10n), 1n);
      }),
    );
  });

  await t.step("rounds down with any negative quotient above half", () => {
    fc.assert(
      fc.property(fc.integer({ min: -9, max: -6 }), (a) => {
        assertEquals(halfOdd(BigInt(a), 10n), -1n);
      }),
    );
  });

  await t.step(
    "rounds down with any positive float quotient below half",
    () => {
      fc.assert(
        fc.property(fc.integer({ min: 1, max: 4 }), (a) => {
          assertEquals(halfOdd(BigInt(a), 10n), 0n);
        }),
      );
    },
  );

  await t.step("rounds up with any negative float quotient below half", () => {
    fc.assert(
      fc.property(fc.integer({ min: -4, max: -1 }), (a) => {
        assertEquals(halfOdd(BigInt(a), 10n), -0n);
      }),
    );
  });
});

Deno.test("non-decimal factors", async (t) => {
  await t.step("does not round with a positive integer quotient", () => {
    assertEquals(halfOdd(20n, 5n), 4n);
  });

  await t.step("does not round with a negative integer quotient", () => {
    assertEquals(halfOdd(-20n, 5n), -4n);
  });

  await t.step("does not round with a zero quotient", () => {
    assertEquals(halfOdd(0n, 5n), 0n);
  });

  await t.step(
    "rounds to nearest odd integer with a positive half quotient rounding to an even integer",
    () => {
      assertEquals(halfOdd(3n, 2n), 1n);
    },
  );

  await t.step(
    "rounds to nearest odd integer with a positive half quotient rounding to an odd integer",
    () => {
      assertEquals(halfOdd(5n, 2n), 3n);
    },
  );

  await t.step(
    "rounds to nearest odd integer with a negative half quotient",
    () => {
      assertEquals(halfOdd(-5n, 2n), -3n);
    },
  );

  await t.step("rounds up with any positive float quotient above half", () => {
    fc.assert(
      fc.property(fc.integer({ min: 3, max: 4 }), (a) => {
        assertEquals(halfOdd(BigInt(a), 5n), 1n);
      }),
    );
  });

  await t.step("rounds down with any negative quotient above half", () => {
    fc.assert(
      fc.property(fc.integer({ min: -4, max: -3 }), (a) => {
        assertEquals(halfOdd(BigInt(a), 5n), -1n);
      }),
    );
  });

  await t.step(
    "rounds down with any positive float quotient below half",
    () => {
      fc.assert(
        fc.property(fc.integer({ min: 1, max: 2 }), (a) => {
          assertEquals(halfOdd(BigInt(a), 5n), 0n);
        }),
      );
    },
  );

  await t.step("rounds up with any negative float quotient below half", () => {
    fc.assert(
      fc.property(fc.integer({ min: -2, max: -1 }), (a) => {
        assertEquals(halfOdd(BigInt(a), 5n), -0n);
      }),
    );
  });
});
