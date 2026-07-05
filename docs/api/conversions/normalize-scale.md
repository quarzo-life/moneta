---
title: normalizeScale
description: Normalize a set of Money objects to the highest scale of the set.
returns: Money[]
---

# normalizeScale

Normalize a set of Money objects to the highest [scale](/core-concepts/scale) of
the set.

Normalizing to a higher scale means the internal `amount` increases by orders of
magnitude to preserve the represented value. Every binary operation in the API
(`add`, `subtract`, the comparisons, …) calls `normalizeScale` internally before
operating on two objects, so you rarely need to call it directly.

## Parameters

| Name            | Type                   | Description                     | Required |
| --------------- | ---------------------- | ------------------------------- | -------- |
| `monetaObjects` | `ReadonlyArray<Money>` | The Money objects to normalize. | Yes      |

## Code examples

### Normalize objects to the same scale

```ts
import { money, normalizeScale, USD } from "jsr:@quarzo-life/moneta";

const d1 = money({ amount: 100n, currency: USD, scale: 2 });
const d2 = money({ amount: 2000n, currency: USD, scale: 3 });

const [one, two] = normalizeScale([d1, d2]);

one; // a Money object with amount 1000n and scale 3
two; // a Money object with amount 2000n and scale 3
```
