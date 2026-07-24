import { expect, test } from "vitest";
import { MGA, USD } from "currencies/index.ts";
import { allocate, toSnapshot } from "api/index.ts";
import { money } from "mod";

test("allocate - decimal currencies - allocates to percentages", () => {
  const d = money({ amount: 1003n, currency: USD });
  const shares = allocate(d, [50, 50]);
  const [firstAllocated, secondAllocated] = shares;

  expect(toSnapshot(firstAllocated)).toEqual({
    amount: 502n,
    currency: USD,
    scale: 2,
  });
  expect(toSnapshot(secondAllocated)).toEqual({
    amount: 501n,
    currency: USD,
    scale: 2,
  });
});

test("allocate - decimal currencies - allocates to ratios", () => {
  const d = money({ amount: 100n, currency: USD });
  const shares = allocate(d, [1, 3]);
  const [firstAllocated, secondAllocated] = shares;

  expect(toSnapshot(firstAllocated)).toEqual({
    amount: 25n,
    currency: USD,
    scale: 2,
  });
  expect(toSnapshot(secondAllocated)).toEqual({
    amount: 75n,
    currency: USD,
    scale: 2,
  });
});

test("allocate - decimal currencies - ignores zero ratios", () => {
  const d = money({ amount: 1003n, currency: USD });
  const shares = allocate(d, [0, 50, 50]);
  const [firstAllocated, secondAllocated, thirdAllocated] = shares;

  expect(toSnapshot(firstAllocated)).toEqual({
    amount: 0n,
    currency: USD,
    scale: 2,
  });
  expect(toSnapshot(secondAllocated)).toEqual({
    amount: 502n,
    currency: USD,
    scale: 2,
  });
  expect(toSnapshot(thirdAllocated)).toEqual({
    amount: 501n,
    currency: USD,
    scale: 2,
  });
});

test("allocate - decimal currencies - converts the allocated amounts to the safest scale", () => {
  const d = money({ amount: 100n, currency: USD });
  const shares = allocate(d, [
    { amount: 505n, scale: 1 },
    { amount: 495n, scale: 1 },
  ]);
  const [firstAllocated, secondAllocated] = shares;

  expect(toSnapshot(firstAllocated)).toEqual({
    amount: 505n,
    currency: USD,
    scale: 3,
  });
  expect(toSnapshot(secondAllocated)).toEqual({
    amount: 495n,
    currency: USD,
    scale: 3,
  });
});

test("allocate - decimal currencies - converts the ratios to the same scale before allocating", () => {
  const d = money({ amount: 100n, currency: USD });
  const shares = allocate(d, [
    { amount: 5050n, scale: 2 },
    { amount: 495n, scale: 1 },
  ]);
  const [firstAllocated, secondAllocated] = shares;

  expect(toSnapshot(firstAllocated)).toEqual({
    amount: 5050n,
    currency: USD,
    scale: 4,
  });
  expect(toSnapshot(secondAllocated)).toEqual({
    amount: 4950n,
    currency: USD,
    scale: 4,
  });
});

test("allocate - decimal currencies - throws when using empty ratios", () => {
  const d = money({ amount: 100n, currency: USD });

  expect(() => {
    allocate(d, []);
  }).toThrow("[Money] Ratios are invalid.");
});

test("allocate - decimal currencies - throws when using negative ratios", () => {
  const d = money({ amount: 100n, currency: USD });

  expect(() => {
    allocate(d, [-50, -50]);
  }).toThrow("[Money] Ratios are invalid.");
});

test("allocate - decimal currencies - throws when using only zero ratios", () => {
  const d = money({ amount: 100n, currency: USD });

  expect(() => {
    allocate(d, [0, 0]);
  }).toThrow("[Money] Ratios are invalid.");
});

test("allocate - non-decimal currencies - allocates to percentages", () => {
  const d = money({ amount: 5n, currency: MGA });
  const shares = allocate(d, [50, 50]);
  const [firstAllocated, secondAllocated] = shares;

  expect(toSnapshot(firstAllocated)).toEqual({
    amount: 3n,
    currency: MGA,
    scale: 1,
  });
  expect(toSnapshot(secondAllocated)).toEqual({
    amount: 2n,
    currency: MGA,
    scale: 1,
  });
});

test("allocate - non-decimal currencies - allocates to ratios", () => {
  const d = money({ amount: 5n, currency: MGA });
  const shares = allocate(d, [1, 3]);
  const [firstAllocated, secondAllocated] = shares;

  expect(toSnapshot(firstAllocated)).toEqual({
    amount: 2n,
    currency: MGA,
    scale: 1,
  });
  expect(toSnapshot(secondAllocated)).toEqual({
    amount: 3n,
    currency: MGA,
    scale: 1,
  });
});

test("allocate - non-decimal currencies - ignores zero ratios", () => {
  const d = money({ amount: 5n, currency: MGA });
  const shares = allocate(d, [0, 50, 50]);
  const [firstAllocated, secondAllocated, thirdAllocated] = shares;

  expect(toSnapshot(firstAllocated)).toEqual({
    amount: 0n,
    currency: MGA,
    scale: 1,
  });
  expect(toSnapshot(secondAllocated)).toEqual({
    amount: 3n,
    currency: MGA,
    scale: 1,
  });
  expect(toSnapshot(thirdAllocated)).toEqual({
    amount: 2n,
    currency: MGA,
    scale: 1,
  });
});

test("allocate - non-decimal currencies - converts the allocated amounts to the safest scale", () => {
  const d = money({ amount: 5n, currency: MGA });
  const shares = allocate(d, [
    { amount: 505n, scale: 1 },
    { amount: 495n, scale: 1 },
  ]);
  const [firstAllocated, secondAllocated] = shares;

  expect(toSnapshot(firstAllocated)).toEqual({
    amount: 13n,
    currency: MGA,
    scale: 2,
  });
  expect(toSnapshot(secondAllocated)).toEqual({
    amount: 12n,
    currency: MGA,
    scale: 2,
  });
});

test("allocate - non-decimal currencies - converts the ratios to the same scale before allocating", () => {
  const d = money({ amount: 5n, currency: MGA });
  const shares = allocate(d, [
    { amount: 5050n, scale: 2 },
    { amount: 495n, scale: 1 },
  ]);
  const [firstAllocated, secondAllocated] = shares;

  expect(toSnapshot(firstAllocated)).toEqual({
    amount: 64n,
    currency: MGA,
    scale: 3,
  });
  expect(toSnapshot(secondAllocated)).toEqual({
    amount: 61n,
    currency: MGA,
    scale: 3,
  });
});

test("allocate - non-decimal currencies - throws when using empty ratios", () => {
  const d = money({ amount: 5n, currency: MGA });

  expect(() => {
    allocate(d, []);
  }).toThrow("[Money] Ratios are invalid.");
});

test("allocate - non-decimal currencies - throws when using negative ratios", () => {
  const d = money({ amount: 5n, currency: MGA });

  expect(() => {
    allocate(d, [-50, -50]);
  }).toThrow("[Money] Ratios are invalid.");
});

test("allocate - non-decimal currencies - throws when using only zero ratios", () => {
  const d = money({ amount: 5n, currency: MGA });

  expect(() => {
    allocate(d, [0, 0]);
  }).toThrow("[Money] Ratios are invalid.");
});

test("allocate - single ratio - assigns entire amount", () => {
  const d = money({ amount: 1003n, currency: USD });
  const [allocated] = allocate(d, [100]);

  expect(toSnapshot(allocated)).toEqual({
    amount: 1003n,
    currency: USD,
    scale: 2,
  });
});

test("allocate - zero amount - all shares are zero", () => {
  const d = money({ amount: 0n, currency: USD });
  const [first, second] = allocate(d, [50, 50]);

  expect(toSnapshot(first)).toEqual({ amount: 0n, currency: USD, scale: 2 });
  expect(toSnapshot(second)).toEqual({ amount: 0n, currency: USD, scale: 2 });
});

test("allocate - 3-way equal split - distributes remainder to first recipient", () => {
  const d = money({ amount: 100n, currency: USD });
  const [first, second, third] = allocate(d, [1, 1, 1]);

  expect(toSnapshot(first)).toEqual({ amount: 34n, currency: USD, scale: 2 });
  expect(toSnapshot(second)).toEqual({ amount: 33n, currency: USD, scale: 2 });
  expect(toSnapshot(third)).toEqual({ amount: 33n, currency: USD, scale: 2 });
});

test("allocate - indivisible unit - remainder goes to first non-zero recipient", () => {
  const d = money({ amount: 1n, currency: USD });
  const [first, second, third] = allocate(d, [1, 1, 1]);

  expect(toSnapshot(first)).toEqual({ amount: 1n, currency: USD, scale: 2 });
  expect(toSnapshot(second)).toEqual({ amount: 0n, currency: USD, scale: 2 });
  expect(toSnapshot(third)).toEqual({ amount: 0n, currency: USD, scale: 2 });
});

test("allocate - only last ratio non-zero - full amount goes to last recipient", () => {
  const d = money({ amount: 1003n, currency: USD });
  const [first, second, third] = allocate(d, [0, 0, 100]);

  expect(toSnapshot(first)).toEqual({ amount: 0n, currency: USD, scale: 2 });
  expect(toSnapshot(second)).toEqual({ amount: 0n, currency: USD, scale: 2 });
  expect(toSnapshot(third)).toEqual({ amount: 1003n, currency: USD, scale: 2 });
});

test("allocate - throws when mixing negative and positive ratios", () => {
  const d = money({ amount: 100n, currency: USD });

  expect(() => {
    allocate(d, [-1, 101]);
  }).toThrow("[Money] Ratios are invalid.");
});
