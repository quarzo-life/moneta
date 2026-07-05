---
title: allocate
description: Distribute a Money object's amount across a list of ratios.
returns: Money[]
---

# allocate

Distribute the amount of a Money object across a list of ratios.

Monetary values have indivisible units, meaning you can't always split them
exactly. `allocate` splits a monetary amount and distributes the remainder as
evenly as possible, so the sum of the returned objects always equals the
original amount — no pennies are lost.

You can use percentage or ratio style for `ratios`: `[25, 75]` and `[1, 3]` do
the same thing. You can also pass zero ratios (such as `[0, 50, 50]`) — if
there's a remainder to distribute, zero ratios are skipped and return a Money
object with amount zero.

If you need fractional ratios, don't use floats — use scaled amounts instead.
For example, instead of `[50.5, 49.5]`, pass
`[{ amount: 505n, scale: 1 }, { amount: 495n, scale: 1 }]`.

**All ratios must be positive, and you can't pass only zero ratios.**

## Parameters

| Name           | Type                                    | Description                                                                  | Required |
| -------------- | --------------------------------------- | ---------------------------------------------------------------------------- | -------- |
| `monetaObject` | `Money`                                 | The Money object to allocate from.                                           | Yes      |
| `ratios`       | `ReadonlyArray<ScaledAmount \| number>` | The ratios to allocate the amount to, in the order the results are returned. | Yes      |

The scale of the returned objects depends on the type of ratios provided:

- **Plain numbers** (scale 0): results share the scale of `monetaObject`.
- **Scaled amounts** `{ amount, scale }`: results use the scale of
  `monetaObject` plus the highest scale found among the ratios.

## Throws

- If `ratios` is empty.
- If any ratio is negative.
- If every ratio is zero.

## Code examples

### Allocate to percentages

```ts
import { allocate, EUR, money } from "jsr:@quarzo-life/moneta";

const m = money({ amount: 500n, currency: EUR });
const [m1, m2] = allocate(m, [50, 50]);

m1; // a Money object with amount 250n
m2; // a Money object with amount 250n
```

### Allocate to ratios

```ts
import { allocate, EUR, money } from "jsr:@quarzo-life/moneta";

const m = money({ amount: 100n, currency: EUR });
const [m1, m2] = allocate(m, [1, 3]);

m1; // a Money object with amount 25n
m2; // a Money object with amount 75n
```

### Distribute as fairly as possible

When the amount doesn't divide evenly, the remainder is spread across the
recipients instead of being dropped.

```ts
import { allocate, EUR, money } from "jsr:@quarzo-life/moneta";

const m = money({ amount: 1003n, currency: EUR });
const [m1, m2] = allocate(m, [50, 50]);

m1; // a Money object with amount 502n
m2; // a Money object with amount 501n
```

### Ignore zero ratios

```ts
import { allocate, EUR, money } from "jsr:@quarzo-life/moneta";

const m = money({ amount: 1003n, currency: EUR });
const [m1, m2, m3] = allocate(m, [0, 50, 50]);

m1; // a Money object with amount 0n
m2; // a Money object with amount 502n
m3; // a Money object with amount 501n
```

### Use scaled ratios and convert to the safest scale

```ts
import { allocate, EUR, money } from "jsr:@quarzo-life/moneta";

const ratios = [
  { amount: 505n, scale: 1 },
  { amount: 495n, scale: 1 },
]; // translates to ratios 50.5 and 49.5

const m = money({ amount: 100n, currency: EUR });
const [m1, m2] = allocate(m, ratios);

m1; // a Money object with amount 505n and scale 3
m2; // a Money object with amount 495n and scale 3
```
