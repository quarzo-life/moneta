import { describe, expect, test } from "vitest";
import { down } from "../index.ts";
import * as fc from "fast-check";

describe("down - decimal factors", () => {
  test("does not round with a positive integer quotient", () => {
    expect(down(20n, 10n)).toEqual(2n);
  });

  test("does not round with a negative integer quotient", () => {
    expect(down(-20n, 10n)).toEqual(-2n);
  });

  test("does not round with a zero quotient", () => {
    expect(down(0n, 10n)).toEqual(0n);
  });

  test("rounds down with a positive half quotient", () => {
    expect(down(15n, 10n)).toEqual(1n);
  });

  test("rounds down with a negative half quotient", () => {
    expect(down(-15n, 10n)).toEqual(-2n);
  });

  test("rounds down with any positive float quotient", () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 9 }), (a) => {
        expect(down(BigInt(a), 10n)).toEqual(0n);
      }),
    );
  });

  test("rounds down with any negative float quotient", () => {
    fc.assert(
      fc.property(fc.integer({ min: -9, max: -1 }), (a) => {
        expect(down(BigInt(a), 10n)).toEqual(-1n);
      }),
    );
  });
});

describe("down - non-decimal factors", () => {
  test("does not round with a positive integer quotient", () => {
    expect(down(20n, 5n)).toEqual(4n);
  });

  test("does not round with a negative integer quotient", () => {
    expect(down(-20n, 5n)).toEqual(-4n);
  });

  test("does not round with a zero quotient", () => {
    expect(down(0n, 5n)).toEqual(0n);
  });

  test("rounds down with a positive half quotient", () => {
    expect(down(3n, 2n)).toEqual(1n);
  });

  test("rounds down with a negative half quotient", () => {
    expect(down(-3n, 2n)).toEqual(-2n);
  });

  test("rounds down with any positive float", () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 4 }), (a) => {
        expect(down(BigInt(a), 5n)).toEqual(0n);
      }),
    );
  });

  test("rounds down with any negative float", () => {
    fc.assert(
      fc.property(fc.integer({ min: -4, max: -1 }), (a) => {
        expect(down(BigInt(a), 5n)).toEqual(-1n);
      }),
    );
  });
});
