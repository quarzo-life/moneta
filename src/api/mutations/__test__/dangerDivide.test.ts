import { expect, test } from "vitest";
import * as fc from "fast-check";
import { JPY, MGA, USD } from "currencies/index.ts";
import { dangerDivide, toSnapshot } from "api/index.ts";
import { money } from "mod";
import {
  down,
  halfAwayFromZero,
  halfDown,
  halfEven,
  halfOdd,
  halfTowardsZero,
  halfUp,
  up,
} from "divide/index.ts";
import type { DivideOperation } from "types/types.ts";

test("dangerDivide - integer divisor - exact division", () => {
  const m = money({ amount: 1000n, currency: USD });

  expect(toSnapshot(dangerDivide(m, 4, down))).toEqual({
    amount: 250n,
    currency: USD,
    scale: 2,
  });
});

test("dangerDivide - integer divisor - rounds down", () => {
  const m = money({ amount: 1000n, currency: USD });

  expect(toSnapshot(dangerDivide(m, 3, down))).toEqual({
    amount: 333n,
    currency: USD,
    scale: 2,
  });
});

test("dangerDivide - integer divisor - rounds up", () => {
  const m = money({ amount: 1000n, currency: USD });

  expect(toSnapshot(dangerDivide(m, 3, up))).toEqual({
    amount: 334n,
    currency: USD,
    scale: 2,
  });
});

test("dangerDivide - integer divisor - rounds halfUp", () => {
  // 1000 / 3 = 333.33… → halfUp → 333
  const m = money({ amount: 1000n, currency: USD });

  expect(toSnapshot(dangerDivide(m, 3, halfUp))).toEqual({
    amount: 333n,
    currency: USD,
    scale: 2,
  });
});

test("dangerDivide - bigint divisor - exact division", () => {
  const m = money({ amount: 1000n, currency: USD });

  expect(toSnapshot(dangerDivide(m, 4n, down))).toEqual({
    amount: 250n,
    currency: USD,
    scale: 2,
  });
});

test("dangerDivide - scaled divisor - exact fractional division", () => {
  // 1000n / 0.5 = 2000n
  const m = money({ amount: 1000n, currency: USD });

  expect(toSnapshot(dangerDivide(m, { amount: 5n, scale: 1 }, down))).toEqual({
    amount: 2000n,
    currency: USD,
    scale: 2,
  });
});

test("dangerDivide - scaled divisor - rounds down", () => {
  // 1000n / 0.3 = 3333.33… → down → 3333
  const m = money({ amount: 1000n, currency: USD });

  expect(toSnapshot(dangerDivide(m, { amount: 3n, scale: 1 }, down))).toEqual({
    amount: 3333n,
    currency: USD,
    scale: 2,
  });
});

test("dangerDivide - scaled divisor - rounds up", () => {
  // 1000n / 0.3 = 3333.33… → up → 3334
  const m = money({ amount: 1000n, currency: USD });

  expect(toSnapshot(dangerDivide(m, { amount: 3n, scale: 1 }, up))).toEqual({
    amount: 3334n,
    currency: USD,
    scale: 2,
  });
});

test("dangerDivide - preserves scale", () => {
  const m = money({ amount: 10000n, currency: USD, scale: 3 });

  expect(toSnapshot(dangerDivide(m, 3, down))).toEqual({
    amount: 3333n,
    currency: USD,
    scale: 3,
  });
});

test("dangerDivide - non-decimal currency (MGA)", () => {
  const m = money({ amount: 100n, currency: MGA });

  expect(toSnapshot(dangerDivide(m, 3, down))).toEqual({
    amount: 33n,
    currency: MGA,
    scale: 1,
  });
});

test("dangerDivide - zero-exponent currency (JPY) - exact", () => {
  const m = money({ amount: 1000n, currency: JPY });

  expect(toSnapshot(dangerDivide(m, 4, down))).toEqual({
    amount: 250n,
    currency: JPY,
    scale: 0,
  });
});

test("dangerDivide - throws on a zero divisor", () => {
  const m = money({ amount: 1000n, currency: USD });

  expect(() => dangerDivide(m, 0, down)).toThrow(
    "[Money] Cannot divide by zero.",
  );
  expect(() => dangerDivide(m, 0n, down)).toThrow(
    "[Money] Cannot divide by zero.",
  );
  expect(() => dangerDivide(m, { amount: 0n, scale: 2 }, down)).toThrow(
    "[Money] Cannot divide by zero.",
  );
});

test("dangerDivide - negative divisor - rounds in the right direction", () => {
  // $10.00 / -3 = -3.333…
  const m = money({ amount: 1000n, currency: USD });

  expect(dangerDivide(m, -3, down).amount).toBe(-334n);
  expect(dangerDivide(m, -3, up).amount).toBe(-333n);
  expect(dangerDivide(m, -3, halfUp).amount).toBe(-333n);
  expect(dangerDivide(m, { amount: -3n, scale: 1 }, down).amount).toBe(
    -3334n,
  );
});

test("dangerDivide - negative dividend and divisor give a positive result", () => {
  // -$10.00 / -3 = 3.333…
  const m = money({ amount: -1000n, currency: USD });

  expect(dangerDivide(m, -3, down).amount).toBe(333n);
  expect(dangerDivide(m, -3, up).amount).toBe(334n);
});

// Reference rounding of n / d (d > 0), written independently of src/divide.
const reference = (
  tie: (floor: bigint) => bigint,
  nonTie: "floor" | "ceil" | "nearest",
) =>
(n: bigint, d: bigint): bigint => {
  const floor = n >= 0n || n % d === 0n ? n / d : n / d - 1n;
  const twiceRemainder = 2n * (n - floor * d);
  if (twiceRemainder === 0n) return floor;
  if (nonTie === "floor") return floor;
  if (nonTie === "ceil") return floor + 1n;
  if (twiceRemainder < d) return floor;
  if (twiceRemainder > d) return floor + 1n;
  return tie(floor);
};

const isEvenBigInt = (n: bigint) => n % 2n === 0n;

const strategies: Array<
  [string, DivideOperation, ReturnType<typeof reference>]
> = [
  ["down", down, reference((f) => f, "floor")],
  ["up", up, reference((f) => f + 1n, "ceil")],
  ["halfUp", halfUp, reference((f) => f + 1n, "nearest")],
  ["halfDown", halfDown, reference((f) => f, "nearest")],
  [
    "halfEven",
    halfEven,
    reference((f) => (isEvenBigInt(f) ? f : f + 1n), "nearest"),
  ],
  [
    "halfOdd",
    halfOdd,
    reference((f) => (isEvenBigInt(f) ? f + 1n : f), "nearest"),
  ],
  [
    "halfTowardsZero",
    halfTowardsZero,
    reference((f) => (f >= 0n ? f : f + 1n), "nearest"),
  ],
  [
    "halfAwayFromZero",
    halfAwayFromZero,
    reference((f) => (f >= 0n ? f + 1n : f), "nearest"),
  ],
];

test.each(strategies)(
  "dangerDivide - %s matches the reference rounding for any signs",
  (_name, op, expected) => {
    fc.assert(
      fc.property(
        fc.bigInt({ min: -100000n, max: 100000n }),
        fc.bigInt({ min: -1000n, max: 1000n }).filter((d) => d !== 0n),
        (amount, divisor) => {
          const m = money({ amount, currency: USD });
          const absDivisor = divisor < 0n ? -divisor : divisor;
          const n = divisor < 0n ? -amount : amount;

          expect(dangerDivide(m, divisor, op).amount).toBe(
            expected(n, absDivisor),
          );
        },
      ),
    );
  },
);
