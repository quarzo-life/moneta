---
title: Allocating without losing pennies
description: How to split a Money object across recipients fairly, using allocate.
---

# Allocating without losing pennies

Monetary values have indivisible units — you can't always split an amount
exactly. Splitting $10.00 three ways gives $3.33, $3.33, and $3.33... which only
adds up to $9.99. [`allocate`](/api/mutations/allocate) solves this: it
distributes the remainder as evenly as possible, so the parts always sum back to
the original amount.

```ts
import { allocate, money, USD } from "jsr:@quarzo-life/moneta";

const total = money({ amount: 1000n, currency: USD }); // $10.00
const [a, b, c] = allocate(total, [1, 1, 1]);

a.amount; // 334n ($3.34)
b.amount; // 333n ($3.33)
c.amount; // 333n ($3.33)
// a + b + c === total, exactly
```

Compare this with [`dangerDivide`](/api/mutations/danger-divide), which would
give you $3.33 and quietly lose the extra cent — see the
[Danger-prefixed operations guide](/guides/danger-operations) for when that
trade-off is actually what you want.

## Splitting a bill

`allocate` accepts either ratios or percentages — `[1, 3]` and `[25, 75]`
produce identical splits:

```ts
import { allocate, EUR, money } from "jsr:@quarzo-life/moneta";

const bill = money({ amount: 10000n, currency: EUR }); // 100,00 EUR

allocate(bill, [25, 75]); // [25,00 EUR, 75,00 EUR]
allocate(bill, [1, 3]); // same result: [25,00 EUR, 75,00 EUR]
```

## Handling recipients who get nothing

You can pass zero ratios — useful when a recipient exists in your data model but
shouldn't receive a share this time. Zero ratios are skipped when the remainder
is distributed, so they always end up with exactly zero:

```ts
import { allocate, EUR, money } from "jsr:@quarzo-life/moneta";

const m = money({ amount: 1003n, currency: EUR });
const [m1, m2, m3] = allocate(m, [0, 50, 50]);

m1.amount; // 0n
m2.amount; // 502n
m3.amount; // 501n
```

You can't pass _only_ zero ratios, though — `allocate` throws if there's nothing
meaningful to allocate to.

## Fractional ratios

If your ratios have decimals (e.g. `50.5` / `49.5`), don't use floats — pass
[scaled amounts](/core-concepts/scale) instead:

```ts
import { allocate, EUR, money } from "jsr:@quarzo-life/moneta";

const ratios = [
  { amount: 505n, scale: 1 }, // 50.5
  { amount: 495n, scale: 1 }, // 49.5
];

const m = money({ amount: 100n, currency: EUR });
const [m1, m2] = allocate(m, ratios);

m1; // a Money object with amount 505n and scale 3
m2; // a Money object with amount 495n and scale 3
```

The result's scale grows to accommodate the ratios' own precision — same
principle as [multiplying by a scaled amount](/core-concepts/scale).
