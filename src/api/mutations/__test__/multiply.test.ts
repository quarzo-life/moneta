import { expect, test } from "vitest";
import { USD } from "currencies/index.ts";
import { multiply, toSnapshot } from "api/index.ts";
import { money } from "mod";

// Number tests
test("multiply - number: multiplies positive Money objects", () => {
  const d = money({ amount: 400n, currency: USD });

  expect(toSnapshot(multiply(d, 4))).toEqual({
    amount: 1600n,
    scale: 2,
    currency: USD,
  });
  expect(toSnapshot(multiply(d, -1))).toEqual({
    amount: -400n,
    scale: 2,
    currency: USD,
  });
});

test("multiply - number: multiplies negative Money objects", () => {
  const d = money({ amount: -400n, currency: USD });

  expect(toSnapshot(multiply(d, 4))).toEqual({
    amount: -1600n,
    scale: 2,
    currency: USD,
  });
  expect(toSnapshot(multiply(d, 1))).toEqual({
    amount: -400n,
    scale: 2,
    currency: USD,
  });
});

test("multiply - number: converts multiplied amount to safest scale", () => {
  const d = money({ amount: 401n, currency: USD });

  const snapshot = toSnapshot(multiply(d, { amount: 2001n, scale: 3 }));
  expect(snapshot).toEqual({
    amount: 802401n,
    scale: 5,
    currency: USD,
  });
});
