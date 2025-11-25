import { assertEquals, assertThrows } from "@std/assert";
import { MGA, USD } from "../../currencies/index.ts";
import { allocate, toSnapshot } from "../index.ts";
import { Money } from "../../../mod.ts";

Deno.test("allocate - decimal currencies - allocates to percentages", () => {
  const d = new Money({ amount: 1003n, currency: USD });
  const shares = allocate(d, [50, 50]);
  const [firstAllocated, secondAllocated] = shares;

  assertEquals(toSnapshot(firstAllocated), {
    amount: 502n,
    currency: USD,
    scale: 2,
  });
  assertEquals(toSnapshot(secondAllocated), {
    amount: 501n,
    currency: USD,
    scale: 2,
  });
});

Deno.test("allocate - decimal currencies - allocates to ratios", () => {
  const d = new Money({ amount: 100n, currency: USD });
  const shares = allocate(d, [1, 3]);
  const [firstAllocated, secondAllocated] = shares;

  assertEquals(toSnapshot(firstAllocated), {
    amount: 25n,
    currency: USD,
    scale: 2,
  });
  assertEquals(toSnapshot(secondAllocated), {
    amount: 75n,
    currency: USD,
    scale: 2,
  });
});

Deno.test("allocate - decimal currencies - ignores zero ratios", () => {
  const d = new Money({ amount: 1003n, currency: USD });
  const shares = allocate(d, [0, 50, 50]);
  const [firstAllocated, secondAllocated, thirdAllocated] = shares;

  assertEquals(toSnapshot(firstAllocated), {
    amount: 0n,
    currency: USD,
    scale: 2,
  });
  assertEquals(toSnapshot(secondAllocated), {
    amount: 502n,
    currency: USD,
    scale: 2,
  });
  assertEquals(toSnapshot(thirdAllocated), {
    amount: 501n,
    currency: USD,
    scale: 2,
  });
});

Deno.test("allocate - decimal currencies - converts the allocated amounts to the safest scale", () => {
  const d = new Money({ amount: 100n, currency: USD });
  const shares = allocate(d, [
    { amount: 505n, scale: 1 },
    { amount: 495n, scale: 1 },
  ]);
  const [firstAllocated, secondAllocated] = shares;

  assertEquals(toSnapshot(firstAllocated), {
    amount: 505n,
    currency: USD,
    scale: 3,
  });
  assertEquals(toSnapshot(secondAllocated), {
    amount: 495n,
    currency: USD,
    scale: 3,
  });
});

Deno.test("allocate - decimal currencies - converts the ratios to the same scale before allocating", () => {
  const d = new Money({ amount: 100n, currency: USD });
  const shares = allocate(d, [
    { amount: 5050n, scale: 2 },
    { amount: 495n, scale: 1 },
  ]);
  const [firstAllocated, secondAllocated] = shares;

  assertEquals(toSnapshot(firstAllocated), {
    amount: 5050n,
    currency: USD,
    scale: 4,
  });
  assertEquals(toSnapshot(secondAllocated), {
    amount: 4950n,
    currency: USD,
    scale: 4,
  });
});

Deno.test("allocate - decimal currencies - throws when using empty ratios", () => {
  const d = new Money({ amount: 100n, currency: USD });

  assertThrows(
    () => {
      allocate(d, []);
    },
    Error,
    "[Money] Ratios are invalid.",
  );
});

Deno.test("allocate - decimal currencies - throws when using negative ratios", () => {
  const d = new Money({ amount: 100n, currency: USD });

  assertThrows(
    () => {
      allocate(d, [-50, -50]);
    },
    Error,
    "[Money] Ratios are invalid.",
  );
});

Deno.test("allocate - decimal currencies - throws when using only zero ratios", () => {
  const d = new Money({ amount: 100n, currency: USD });

  assertThrows(
    () => {
      allocate(d, [0, 0]);
    },
    Error,
    "[Money] Ratios are invalid.",
  );
});

Deno.test("allocate - non-decimal currencies - allocates to percentages", () => {
  const d = new Money({ amount: 5n, currency: MGA });
  const shares = allocate(d, [50, 50]);
  const [firstAllocated, secondAllocated] = shares;

  assertEquals(toSnapshot(firstAllocated), {
    amount: 3n,
    currency: MGA,
    scale: 1,
  });
  assertEquals(toSnapshot(secondAllocated), {
    amount: 2n,
    currency: MGA,
    scale: 1,
  });
});

Deno.test("allocate - non-decimal currencies - allocates to ratios", () => {
  const d = new Money({ amount: 5n, currency: MGA });
  const shares = allocate(d, [1, 3]);
  const [firstAllocated, secondAllocated] = shares;

  assertEquals(toSnapshot(firstAllocated), {
    amount: 2n,
    currency: MGA,
    scale: 1,
  });
  assertEquals(toSnapshot(secondAllocated), {
    amount: 3n,
    currency: MGA,
    scale: 1,
  });
});

Deno.test("allocate - non-decimal currencies - ignores zero ratios", () => {
  const d = new Money({ amount: 5n, currency: MGA });
  const shares = allocate(d, [0, 50, 50]);
  const [firstAllocated, secondAllocated, thirdAllocated] = shares;

  assertEquals(toSnapshot(firstAllocated), {
    amount: 0n,
    currency: MGA,
    scale: 1,
  });
  assertEquals(toSnapshot(secondAllocated), {
    amount: 3n,
    currency: MGA,
    scale: 1,
  });
  assertEquals(toSnapshot(thirdAllocated), {
    amount: 2n,
    currency: MGA,
    scale: 1,
  });
});

Deno.test("allocate - non-decimal currencies - converts the allocated amounts to the safest scale", () => {
  const d = new Money({ amount: 5n, currency: MGA });
  const shares = allocate(d, [
    { amount: 505n, scale: 1 },
    { amount: 495n, scale: 1 },
  ]);
  const [firstAllocated, secondAllocated] = shares;

  assertEquals(toSnapshot(firstAllocated), {
    amount: 13n,
    currency: MGA,
    scale: 2,
  });
  assertEquals(toSnapshot(secondAllocated), {
    amount: 12n,
    currency: MGA,
    scale: 2,
  });
});

Deno.test("allocate - non-decimal currencies - converts the ratios to the same scale before allocating", () => {
  const d = new Money({ amount: 5n, currency: MGA });
  const shares = allocate(d, [
    { amount: 5050n, scale: 2 },
    { amount: 495n, scale: 1 },
  ]);
  const [firstAllocated, secondAllocated] = shares;

  assertEquals(toSnapshot(firstAllocated), {
    amount: 64n,
    currency: MGA,
    scale: 3,
  });
  assertEquals(toSnapshot(secondAllocated), {
    amount: 61n,
    currency: MGA,
    scale: 3,
  });
});

Deno.test("allocate - non-decimal currencies - throws when using empty ratios", () => {
  const d = new Money({ amount: 5n, currency: MGA });

  assertThrows(
    () => {
      allocate(d, []);
    },
    Error,
    "[Money] Ratios are invalid.",
  );
});

Deno.test("allocate - non-decimal currencies - throws when using negative ratios", () => {
  const d = new Money({ amount: 5n, currency: MGA });

  assertThrows(
    () => {
      allocate(d, [-50, -50]);
    },
    Error,
    "[Money] Ratios are invalid.",
  );
});

Deno.test("allocate - non-decimal currencies - throws when using only zero ratios", () => {
  const d = new Money({ amount: 5n, currency: MGA });

  assertThrows(
    () => {
      allocate(d, [0, 0]);
    },
    Error,
    "[Money] Ratios are invalid.",
  );
});
