import { describe, expect, test } from "vitest";
import * as fc from "fast-check";
import { halfOdd } from "../index.ts";

describe("decimal factors", () => {
  test("does not round with a positive integer quotient", () => {
    expect(halfOdd(20n, 10n)).toEqual(2n);
  });

  test("does not round with a negative integer quotient", () => {
    expect(halfOdd(-20n, 10n)).toEqual(-2n);
  });

  test("does not round with a zero quotient", () => {
    expect(halfOdd(0n, 10n)).toEqual(0n);
  });

  test(
    "rounds to nearest odd integer with a positive half quotient rounding to an even integer",
    () => {
      expect(halfOdd(15n, 10n)).toEqual(1n);
    },
  );

  test(
    "rounds to nearest odd integer with a positive half quotient rounding to an odd integer",
    () => {
      expect(halfOdd(25n, 10n)).toEqual(3n);
    },
  );

  test(
    "rounds to nearest odd integer with a negative half quotient",
    () => {
      expect(halfOdd(-25n, 10n)).toEqual(-3n);
    },
  );

  test("rounds up with any positive float quotient above half", () => {
    fc.assert(
      fc.property(fc.integer({ min: 6, max: 9 }), (a) => {
        expect(halfOdd(BigInt(a), 10n)).toEqual(1n);
      }),
    );
  });

  test("rounds down with any negative quotient above half", () => {
    fc.assert(
      fc.property(fc.integer({ min: -9, max: -6 }), (a) => {
        expect(halfOdd(BigInt(a), 10n)).toEqual(-1n);
      }),
    );
  });

  test(
    "rounds down with any positive float quotient below half",
    () => {
      fc.assert(
        fc.property(fc.integer({ min: 1, max: 4 }), (a) => {
          expect(halfOdd(BigInt(a), 10n)).toEqual(0n);
        }),
      );
    },
  );

  test("rounds up with any negative float quotient below half", () => {
    fc.assert(
      fc.property(fc.integer({ min: -4, max: -1 }), (a) => {
        expect(halfOdd(BigInt(a), 10n)).toEqual(-0n);
      }),
    );
  });
});

describe("non-decimal factors", () => {
  test("does not round with a positive integer quotient", () => {
    expect(halfOdd(20n, 5n)).toEqual(4n);
  });

  test("does not round with a negative integer quotient", () => {
    expect(halfOdd(-20n, 5n)).toEqual(-4n);
  });

  test("does not round with a zero quotient", () => {
    expect(halfOdd(0n, 5n)).toEqual(0n);
  });

  test(
    "rounds to nearest odd integer with a positive half quotient rounding to an even integer",
    () => {
      expect(halfOdd(3n, 2n)).toEqual(1n);
    },
  );

  test(
    "rounds to nearest odd integer with a positive half quotient rounding to an odd integer",
    () => {
      expect(halfOdd(5n, 2n)).toEqual(3n);
    },
  );

  test(
    "rounds to nearest odd integer with a negative half quotient",
    () => {
      expect(halfOdd(-5n, 2n)).toEqual(-3n);
    },
  );

  test("rounds up with any positive float quotient above half", () => {
    fc.assert(
      fc.property(fc.integer({ min: 3, max: 4 }), (a) => {
        expect(halfOdd(BigInt(a), 5n)).toEqual(1n);
      }),
    );
  });

  test("rounds down with any negative quotient above half", () => {
    fc.assert(
      fc.property(fc.integer({ min: -4, max: -3 }), (a) => {
        expect(halfOdd(BigInt(a), 5n)).toEqual(-1n);
      }),
    );
  });

  test(
    "rounds down with any positive float quotient below half",
    () => {
      fc.assert(
        fc.property(fc.integer({ min: 1, max: 2 }), (a) => {
          expect(halfOdd(BigInt(a), 5n)).toEqual(0n);
        }),
      );
    },
  );

  test("rounds up with any negative float quotient below half", () => {
    fc.assert(
      fc.property(fc.integer({ min: -2, max: -1 }), (a) => {
        expect(halfOdd(BigInt(a), 5n)).toEqual(-0n);
      }),
    );
  });
});
