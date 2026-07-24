import { expect, test } from "vitest";
import { JPY, USD } from "currencies/index.ts";
import { dangerRound, toSnapshot } from "api/index.ts";
import { money } from "mod";
import { down, halfUp, up } from "divide/index.ts";

test("dangerRound - rounds to currency exponent - down", () => {
  const m = money({ amount: 12345n, currency: USD, scale: 3 }); // $12.345

  expect(toSnapshot(dangerRound(m, down))).toEqual({
    amount: 1234n,
    currency: USD,
    scale: 2,
  });
});

test("dangerRound - rounds to currency exponent - up", () => {
  const m = money({ amount: 12345n, currency: USD, scale: 3 }); // $12.345

  expect(toSnapshot(dangerRound(m, up))).toEqual({
    amount: 1235n,
    currency: USD,
    scale: 2,
  });
});

test("dangerRound - rounds to currency exponent - halfUp", () => {
  // $12.345 → nearest cent halfUp → $12.35
  const m = money({ amount: 12345n, currency: USD, scale: 3 });

  expect(toSnapshot(dangerRound(m, halfUp))).toEqual({
    amount: 1235n,
    currency: USD,
    scale: 2,
  });
});

test("dangerRound - no-op when scale equals exponent", () => {
  const m = money({ amount: 1000n, currency: USD, scale: 2 });
  const result = dangerRound(m, down);

  expect(result).toEqual(m);
});

test("dangerRound - no-op when scale is below exponent", () => {
  const m = money({ amount: 100n, currency: USD, scale: 1 }); // $10.0 (scale < exponent 2)
  const result = dangerRound(m, down);

  expect(result).toEqual(m);
});

test("dangerRound - JPY (exponent 0) - rounds down", () => {
  const m = money({ amount: 12345n, currency: JPY, scale: 2 }); // ¥123.45

  expect(toSnapshot(dangerRound(m, down))).toEqual({
    amount: 123n,
    currency: JPY,
    scale: 0,
  });
});

test("dangerRound - JPY (exponent 0) - rounds up", () => {
  const m = money({ amount: 12345n, currency: JPY, scale: 2 }); // ¥123.45

  expect(toSnapshot(dangerRound(m, up))).toEqual({
    amount: 124n,
    currency: JPY,
    scale: 0,
  });
});

test("dangerRound - JPY (exponent 0) - no-op when already at scale 0", () => {
  const m = money({ amount: 123n, currency: JPY });
  const result = dangerRound(m, down);

  expect(result).toEqual(m);
});

test("dangerRound - large sub-unit scale reduces correctly", () => {
  // $1.23456 (scale 5) → $1.23 (scale 2) with down
  const m = money({ amount: 123456n, currency: USD, scale: 5 });

  expect(toSnapshot(dangerRound(m, down))).toEqual({
    amount: 123n,
    currency: USD,
    scale: 2,
  });
});
