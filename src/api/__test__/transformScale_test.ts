import { assertEquals } from "@std/assert";
import { MGA, USD } from "../../currencies/index.ts";
import {
  down,
  halfAwayFromZero,
  halfDown,
  halfEven,
  halfOdd,
  halfTowardsZero,
  halfUp,
  Money,
  toSnapshot,
  transformScale,
  up,
} from "../../../mod.ts";

const ABC = { code: "ABC", base: 6, exponent: 1 };

Deno.test("transformScale: decimal currencies", async (t) => {
  await t.step(
    "returns a new Money object with a new scale and a converted amount",
    () => {
      const d = new Money({ amount: 500n, currency: USD, scale: 2 });
      const snapshot = toSnapshot(transformScale(d, 4));

      assertEquals(snapshot, { amount: 50000n, currency: USD, scale: 4 });
    },
  );

  await t.step(
    "returns a new Money object with a new scale and a converted, rounded down amount",
    () => {
      const d = new Money({ amount: 14270n, currency: USD, scale: 2 });
      const snapshot = toSnapshot(transformScale(d, 0));

      assertEquals(snapshot, { amount: 142n, currency: USD, scale: 0 });
    },
  );

  await t.step("converts between scales correctly", () => {
    const d = new Money({ amount: 333336n, currency: USD, scale: 5 });
    const snapshot = toSnapshot(transformScale(d, 2));

    assertEquals(snapshot, { amount: 333n, currency: USD, scale: 2 });
  });

  await t.step("converts from long initial scales correctly", () => {
    const d = new Money({ amount: 3333333336n, currency: USD, scale: 9 });
    const snapshot = toSnapshot(transformScale(d, 2));

    assertEquals(snapshot, { amount: 333n, currency: USD, scale: 2 });
  });

  await t.step("uses the provided `up` divide function", () => {
    const d = new Money({ amount: 10455n, currency: USD, scale: 3 });
    const snapshot = toSnapshot(transformScale(d, 2, up));

    assertEquals(snapshot, { amount: 1046n, currency: USD, scale: 2 });
  });

  await t.step("uses the provided `down` divide function", () => {
    const d = new Money({ amount: 10455n, currency: USD, scale: 3 });
    const snapshot = toSnapshot(transformScale(d, 2, down));

    assertEquals(snapshot, { amount: 1045n, currency: USD, scale: 2 });
  });

  await t.step("uses the provided `halfOdd` divide function", () => {
    const d1 = new Money({ amount: 10415n, currency: USD, scale: 3 });
    const d2 = new Money({ amount: 10425n, currency: USD, scale: 3 });

    assertEquals(toSnapshot(transformScale(d1, 2, halfOdd)), {
      amount: 1041n,
      currency: USD,
      scale: 2,
    });
    assertEquals(toSnapshot(transformScale(d2, 2, halfOdd)), {
      amount: 1043n,
      currency: USD,
      scale: 2,
    });
  });

  await t.step("uses the provided `halfEven` divide function", () => {
    const d1 = new Money({ amount: 10425n, currency: USD, scale: 3 });
    const d2 = new Money({ amount: 10435n, currency: USD, scale: 3 });

    assertEquals(toSnapshot(transformScale(d1, 2, halfEven)), {
      amount: 1042n,
      currency: USD,
      scale: 2,
    });
    assertEquals(toSnapshot(transformScale(d2, 2, halfEven)), {
      amount: 1044n,
      currency: USD,
      scale: 2,
    });
  });

  await t.step("uses the provided `halfDown` divide function", () => {
    const d1 = new Money({ amount: 10455n, currency: USD, scale: 3 });
    const d2 = new Money({ amount: 10456n, currency: USD, scale: 3 });

    assertEquals(toSnapshot(transformScale(d1, 2, halfDown)), {
      amount: 1045n,
      currency: USD,
      scale: 2,
    });
    assertEquals(toSnapshot(transformScale(d2, 2, halfDown)), {
      amount: 1046n,
      currency: USD,
      scale: 2,
    });
  });

  await t.step("uses the provided `halfUp` divide function", () => {
    const d1 = new Money({ amount: 10454n, currency: USD, scale: 3 });
    const d2 = new Money({ amount: 10455n, currency: USD, scale: 3 });

    assertEquals(toSnapshot(transformScale(d1, 2, halfUp)), {
      amount: 1045n,
      currency: USD,
      scale: 2,
    });
    assertEquals(toSnapshot(transformScale(d2, 2, halfUp)), {
      amount: 1046n,
      currency: USD,
      scale: 2,
    });
  });

  await t.step("uses the provided `halfTowardsZero` divide function", () => {
    const d1 = new Money({ amount: 10415n, currency: USD, scale: 3 });

    const snapshot = toSnapshot(transformScale(d1, 2, halfTowardsZero));

    assertEquals(snapshot, {
      amount: 1041n,
      currency: USD,
      scale: 2,
    });
  });

  await t.step("uses the provided `halfAwayFromZero` divide function", () => {
    const d1 = new Money({ amount: 10415n, currency: USD, scale: 3 });

    const snapshot = toSnapshot(transformScale(d1, 2, halfAwayFromZero));

    assertEquals(snapshot, {
      amount: 1042n,
      currency: USD,
      scale: 2,
    });
  });

  await t.step("uses a custom divide function", () => {
    const divideFn = (_x: bigint, _y: number) => 1045n;
    const d = new Money({ amount: 10455n, currency: USD, scale: 3 });

    const snapshot = toSnapshot(transformScale(d, 2, divideFn));

    assertEquals(snapshot, { amount: 1045n, currency: USD, scale: 2 });
  });
});

Deno.test("transformScale: non-decimal currencies", async (t) => {
  await t.step(
    "returns a new Money object with a new scale and a converted amount",
    () => {
      const d = new Money({ amount: 5n, currency: MGA });
      const snapshot = toSnapshot(transformScale(d, 2));

      assertEquals(snapshot, { amount: 25n, currency: MGA, scale: 2 });
    },
  );

  await t.step(
    "returns a new Money object with a new scale and a converted, rounded down amount",
    () => {
      const d = new Money({ amount: 26n, currency: MGA, scale: 2 });
      const snapshot = toSnapshot(transformScale(d, 1));

      assertEquals(snapshot, { amount: 5n, currency: MGA, scale: 1 });
    },
  );

  await t.step("uses the provided `up` divide function", () => {
    const d = new Money({ amount: 33n, currency: ABC, scale: 2 });
    const snapshot = toSnapshot(transformScale(d, 1, up));

    assertEquals(snapshot, { amount: 6n, currency: ABC, scale: 1 });
  });

  await t.step("uses the provided `down` divide function", () => {
    const d = new Money({ amount: 33n, currency: ABC, scale: 2 });
    const snapshot = toSnapshot(transformScale(d, 1, down));

    assertEquals(snapshot, { amount: 5n, currency: ABC, scale: 1 });
  });

  await t.step("uses the provided `halfOdd` divide function", () => {
    const d1 = new Money({ amount: 33n, currency: ABC, scale: 2 });
    const d2 = new Money({ amount: 39n, currency: ABC, scale: 2 });

    assertEquals(toSnapshot(transformScale(d1, 1, halfOdd)), {
      amount: 5n,
      currency: ABC,
      scale: 1,
    });
    assertEquals(toSnapshot(transformScale(d2, 1, halfOdd)), {
      amount: 7n,
      currency: ABC,
      scale: 1,
    });
  });

  await t.step("uses the provided `halfEven` divide function", () => {
    const d1 = new Money({ amount: 33n, currency: ABC, scale: 2 });
    const d2 = new Money({ amount: 39n, currency: ABC, scale: 2 });

    assertEquals(toSnapshot(transformScale(d1, 1, halfEven)), {
      amount: 6n,
      currency: ABC,
      scale: 1,
    });
    assertEquals(toSnapshot(transformScale(d2, 1, halfEven)), {
      amount: 6n,
      currency: ABC,
      scale: 1,
    });
  });

  await t.step("uses the provided `halfDown` divide function", () => {
    const d1 = new Money({ amount: 33n, currency: ABC, scale: 2 });
    const d2 = new Money({ amount: 39n, currency: ABC, scale: 2 });

    assertEquals(toSnapshot(transformScale(d1, 1, halfDown)), {
      amount: 5n,
      currency: ABC,
      scale: 1,
    });
    assertEquals(toSnapshot(transformScale(d2, 1, halfDown)), {
      amount: 6n,
      currency: ABC,
      scale: 1,
    });
  });

  await t.step("uses the provided `halfUp` divide function", () => {
    const d1 = new Money({ amount: 33n, currency: ABC, scale: 2 });
    const d2 = new Money({ amount: 39n, currency: ABC, scale: 2 });

    assertEquals(toSnapshot(transformScale(d1, 1, halfUp)), {
      amount: 6n,
      currency: ABC,
      scale: 1,
    });
    assertEquals(toSnapshot(transformScale(d2, 1, halfUp)), {
      amount: 7n,
      currency: ABC,
      scale: 1,
    });
  });

  await t.step("uses the provided `halfTowardsZero` divide function", () => {
    const d1 = new Money({ amount: 33n, currency: ABC, scale: 2 });
    const d2 = new Money({ amount: 39n, currency: ABC, scale: 2 });

    assertEquals(
      toSnapshot(transformScale(d1, 1, halfTowardsZero)),
      {
        amount: 5n,
        currency: ABC,
        scale: 1,
      },
    );
    assertEquals(
      toSnapshot(transformScale(d2, 1, halfTowardsZero)),
      {
        amount: 6n,
        currency: ABC,
        scale: 1,
      },
    );
  });

  await t.step("uses the provided `halfAwayFromZero` divide function", () => {
    const d1 = new Money({ amount: 33n, currency: ABC, scale: 2 });
    const d2 = new Money({ amount: 39n, currency: ABC, scale: 2 });

    assertEquals(
      toSnapshot(transformScale(d1, 1, halfAwayFromZero)),
      {
        amount: 6n,
        currency: ABC,
        scale: 1,
      },
    );
    assertEquals(
      toSnapshot(transformScale(d2, 1, halfAwayFromZero)),
      {
        amount: 7n,
        currency: ABC,
        scale: 1,
      },
    );
  });
});
