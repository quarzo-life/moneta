import { describe, expect, test } from "vitest";
import { MGA, USD } from "currencies/index.ts";
import {
  down,
  halfAwayFromZero,
  halfDown,
  halfEven,
  halfOdd,
  halfTowardsZero,
  halfUp,
  money,
  toSnapshot,
  transformScale,
  up,
} from "mod";

const ABC = { code: "ABC", base: 6, exponent: 1 };

describe("transformScale: decimal currencies", () => {
  test(
    "returns a new Money object with a new scale and a converted amount",
    () => {
      const d = money({ amount: 500n, currency: USD, scale: 2 });
      const snapshot = toSnapshot(transformScale(d, 4));

      expect(snapshot).toEqual({ amount: 50000n, currency: USD, scale: 4 });
    },
  );

  test(
    "returns a new Money object with a new scale and a converted, rounded down amount",
    () => {
      const d = money({ amount: 14270n, currency: USD, scale: 2 });
      const snapshot = toSnapshot(transformScale(d, 0));

      expect(snapshot).toEqual({ amount: 142n, currency: USD, scale: 0 });
    },
  );

  test("converts between scales correctly", () => {
    const d = money({ amount: 333336n, currency: USD, scale: 5 });
    const snapshot = toSnapshot(transformScale(d, 2));

    expect(snapshot).toEqual({ amount: 333n, currency: USD, scale: 2 });
  });

  test("converts from long initial scales correctly", () => {
    const d = money({ amount: 3333333336n, currency: USD, scale: 9 });
    const snapshot = toSnapshot(transformScale(d, 2));

    expect(snapshot).toEqual({ amount: 333n, currency: USD, scale: 2 });
  });

  test("uses the provided `up` divide function", () => {
    const d = money({ amount: 10455n, currency: USD, scale: 3 });
    const snapshot = toSnapshot(transformScale(d, 2, up));

    expect(snapshot).toEqual({ amount: 1046n, currency: USD, scale: 2 });
  });

  test("uses the provided `down` divide function", () => {
    const d = money({ amount: 10455n, currency: USD, scale: 3 });
    const snapshot = toSnapshot(transformScale(d, 2, down));

    expect(snapshot).toEqual({ amount: 1045n, currency: USD, scale: 2 });
  });

  test("uses the provided `halfOdd` divide function", () => {
    const d1 = money({ amount: 10415n, currency: USD, scale: 3 });
    const d2 = money({ amount: 10425n, currency: USD, scale: 3 });

    expect(toSnapshot(transformScale(d1, 2, halfOdd))).toEqual({
      amount: 1041n,
      currency: USD,
      scale: 2,
    });
    expect(toSnapshot(transformScale(d2, 2, halfOdd))).toEqual({
      amount: 1043n,
      currency: USD,
      scale: 2,
    });
  });

  test("uses the provided `halfEven` divide function", () => {
    const d1 = money({ amount: 10425n, currency: USD, scale: 3 });
    const d2 = money({ amount: 10435n, currency: USD, scale: 3 });

    expect(toSnapshot(transformScale(d1, 2, halfEven))).toEqual({
      amount: 1042n,
      currency: USD,
      scale: 2,
    });
    expect(toSnapshot(transformScale(d2, 2, halfEven))).toEqual({
      amount: 1044n,
      currency: USD,
      scale: 2,
    });
  });

  test("uses the provided `halfDown` divide function", () => {
    const d1 = money({ amount: 10455n, currency: USD, scale: 3 });
    const d2 = money({ amount: 10456n, currency: USD, scale: 3 });

    expect(toSnapshot(transformScale(d1, 2, halfDown))).toEqual({
      amount: 1045n,
      currency: USD,
      scale: 2,
    });
    expect(toSnapshot(transformScale(d2, 2, halfDown))).toEqual({
      amount: 1046n,
      currency: USD,
      scale: 2,
    });
  });

  test("uses the provided `halfUp` divide function", () => {
    const d1 = money({ amount: 10454n, currency: USD, scale: 3 });
    const d2 = money({ amount: 10455n, currency: USD, scale: 3 });

    expect(toSnapshot(transformScale(d1, 2, halfUp))).toEqual({
      amount: 1045n,
      currency: USD,
      scale: 2,
    });
    expect(toSnapshot(transformScale(d2, 2, halfUp))).toEqual({
      amount: 1046n,
      currency: USD,
      scale: 2,
    });
  });

  test("uses the provided `halfTowardsZero` divide function", () => {
    const d1 = money({ amount: 10415n, currency: USD, scale: 3 });

    const snapshot = toSnapshot(transformScale(d1, 2, halfTowardsZero));

    expect(snapshot).toEqual({
      amount: 1041n,
      currency: USD,
      scale: 2,
    });
  });

  test("uses the provided `halfAwayFromZero` divide function", () => {
    const d1 = money({ amount: 10415n, currency: USD, scale: 3 });

    const snapshot = toSnapshot(transformScale(d1, 2, halfAwayFromZero));

    expect(snapshot).toEqual({
      amount: 1042n,
      currency: USD,
      scale: 2,
    });
  });

  test("uses a custom divide function", () => {
    const divideFn = (_x: bigint, _y: bigint) => 1045n;
    const d = money({ amount: 10455n, currency: USD, scale: 3 });

    const snapshot = toSnapshot(transformScale(d, 2, divideFn));

    expect(snapshot).toEqual({ amount: 1045n, currency: USD, scale: 2 });
  });
});

describe("transformScale: non-decimal currencies", () => {
  test(
    "returns a new Money object with a new scale and a converted amount",
    () => {
      const d = money({ amount: 5n, currency: MGA });
      const snapshot = toSnapshot(transformScale(d, 2));

      expect(snapshot).toEqual({ amount: 25n, currency: MGA, scale: 2 });
    },
  );

  test(
    "returns a new Money object with a new scale and a converted, rounded down amount",
    () => {
      const d = money({ amount: 26n, currency: MGA, scale: 2 });
      const snapshot = toSnapshot(transformScale(d, 1));

      expect(snapshot).toEqual({ amount: 5n, currency: MGA, scale: 1 });
    },
  );

  test("uses the provided `up` divide function", () => {
    const d = money({ amount: 33n, currency: ABC, scale: 2 });
    const snapshot = toSnapshot(transformScale(d, 1, up));

    expect(snapshot).toEqual({ amount: 6n, currency: ABC, scale: 1 });
  });

  test("uses the provided `down` divide function", () => {
    const d = money({ amount: 33n, currency: ABC, scale: 2 });
    const snapshot = toSnapshot(transformScale(d, 1, down));

    expect(snapshot).toEqual({ amount: 5n, currency: ABC, scale: 1 });
  });

  test("uses the provided `halfOdd` divide function", () => {
    const d1 = money({ amount: 33n, currency: ABC, scale: 2 });
    const d2 = money({ amount: 39n, currency: ABC, scale: 2 });

    expect(toSnapshot(transformScale(d1, 1, halfOdd))).toEqual({
      amount: 5n,
      currency: ABC,
      scale: 1,
    });
    expect(toSnapshot(transformScale(d2, 1, halfOdd))).toEqual({
      amount: 7n,
      currency: ABC,
      scale: 1,
    });
  });

  test("uses the provided `halfEven` divide function", () => {
    const d1 = money({ amount: 33n, currency: ABC, scale: 2 });
    const d2 = money({ amount: 39n, currency: ABC, scale: 2 });

    expect(toSnapshot(transformScale(d1, 1, halfEven))).toEqual({
      amount: 6n,
      currency: ABC,
      scale: 1,
    });
    expect(toSnapshot(transformScale(d2, 1, halfEven))).toEqual({
      amount: 6n,
      currency: ABC,
      scale: 1,
    });
  });

  test("uses the provided `halfDown` divide function", () => {
    const d1 = money({ amount: 33n, currency: ABC, scale: 2 });
    const d2 = money({ amount: 39n, currency: ABC, scale: 2 });

    expect(toSnapshot(transformScale(d1, 1, halfDown))).toEqual({
      amount: 5n,
      currency: ABC,
      scale: 1,
    });
    expect(toSnapshot(transformScale(d2, 1, halfDown))).toEqual({
      amount: 6n,
      currency: ABC,
      scale: 1,
    });
  });

  test("uses the provided `halfUp` divide function", () => {
    const d1 = money({ amount: 33n, currency: ABC, scale: 2 });
    const d2 = money({ amount: 39n, currency: ABC, scale: 2 });

    expect(toSnapshot(transformScale(d1, 1, halfUp))).toEqual({
      amount: 6n,
      currency: ABC,
      scale: 1,
    });
    expect(toSnapshot(transformScale(d2, 1, halfUp))).toEqual({
      amount: 7n,
      currency: ABC,
      scale: 1,
    });
  });

  test("uses the provided `halfTowardsZero` divide function", () => {
    const d1 = money({ amount: 33n, currency: ABC, scale: 2 });
    const d2 = money({ amount: 39n, currency: ABC, scale: 2 });

    expect(toSnapshot(transformScale(d1, 1, halfTowardsZero))).toEqual({
      amount: 5n,
      currency: ABC,
      scale: 1,
    });
    expect(toSnapshot(transformScale(d2, 1, halfTowardsZero))).toEqual({
      amount: 6n,
      currency: ABC,
      scale: 1,
    });
  });

  test("uses the provided `halfAwayFromZero` divide function", () => {
    const d1 = money({ amount: 33n, currency: ABC, scale: 2 });
    const d2 = money({ amount: 39n, currency: ABC, scale: 2 });

    expect(toSnapshot(transformScale(d1, 1, halfAwayFromZero))).toEqual({
      amount: 6n,
      currency: ABC,
      scale: 1,
    });
    expect(toSnapshot(transformScale(d2, 1, halfAwayFromZero))).toEqual({
      amount: 7n,
      currency: ABC,
      scale: 1,
    });
  });
});
