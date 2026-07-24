import { describe, expect, test } from "vitest";
import { up } from "../index.ts";
import * as fc from "fast-check";

describe("up - decimal factors", () => {
  test("does not round with a positive integer quotient", () => {
    expect(up(20n, 10n)).toEqual(2n);
  });

  test("does not round with a negative integer quotient", () => {
    expect(up(-20n, 10n)).toEqual(-2n);
  });

  test("does not round with a zero quotient", () => {
    expect(up(0n, 10n)).toEqual(0n);
  });

  test("rounds up with a positive half quotient", () => {
    expect(up(15n, 10n)).toEqual(2n);
  });

  test("rounds up with a negative half quotient", () => {
    expect(up(-15n, 10n)).toEqual(-1n);
  });

  test("rounds up with any positive float quotient", () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 9 }), (a) => {
        expect(up(BigInt(a), 10n)).toEqual(1n);
      }),
    );
  });

  test("rounds up with any negative float quotient", () => {
    fc.assert(
      fc.property(fc.integer({ min: -9, max: -1 }), (a) => {
        expect(up(BigInt(a), 10n)).toEqual(0n);
      }),
    );
  });
});

describe("up - non-decimal factors", () => {
  test("does not round with a positive integer quotient", () => {
    expect(up(20n, 5n)).toEqual(4n);
  });

  test("does not round with a negative integer quotient", () => {
    expect(up(-20n, 5n)).toEqual(-4n);
  });

  test("does not round with a zero quotient", () => {
    expect(up(0n, 5n)).toEqual(0n);
  });

  test("rounds up with a positive half quotient", () => {
    expect(up(3n, 2n)).toEqual(2n);
  });

  test("rounds up with a negative half quotient", () => {
    expect(up(-3n, 2n)).toEqual(-1n);
  });

  test("rounds up with any positive float quotient", () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 4 }), (a) => {
        expect(up(BigInt(a), 5n)).toEqual(1n);
      }),
    );
  });

  test("rounds up with any negative float quotient", () => {
    fc.assert(
      fc.property(fc.integer({ min: -4, max: -1 }), (a) => {
        expect(up(BigInt(a), 5n)).toEqual(-0n);
      }),
    );
  });
});
