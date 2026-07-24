import { expect, test } from "vitest";
import { money, toSnapshot, trimScale, USD } from "mod";

test("trimScale - number - trims a Money object down to its currency exponent's scale", () => {
  const d = money({ amount: 500000n, currency: USD, scale: 5 });
  const snapshot = toSnapshot(trimScale(d));

  expect(snapshot).toEqual({ amount: 500n, currency: USD, scale: 2 });
});

test("trimScale - number - trims a Money object down to the safest possible scale", () => {
  const d = money({ amount: 55550n, currency: USD, scale: 4 });
  const snapshot = toSnapshot(trimScale(d));

  expect(snapshot).toEqual({ amount: 5555n, currency: USD, scale: 3 });
});

test("trimScale - number - doesn't trim the scale when there's nothing to trim", () => {
  const d = money({ amount: 5555n, currency: USD, scale: 3 });
  const snapshot = toSnapshot(trimScale(d));

  expect(snapshot).toEqual({ amount: 5555n, currency: USD, scale: 3 });
});

test("trimScale - number - doesn't crash on zero amounts", () => {
  const d = money({ amount: 0n, currency: USD });
  const snapshot = toSnapshot(trimScale(d));

  expect(snapshot).toEqual({ amount: 0n, scale: 2, currency: USD });
});
