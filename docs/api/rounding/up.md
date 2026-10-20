---
title: up
description: Divide and round towards positive infinity.
returns: bigint
---

# up

Divide and round towards positive infinity.

This rounding mode always rounds up, regardless of the fractional part. For
positive numbers, any fractional value causes the result to increase (e.g. `1.1`
becomes `2`, `1.9` becomes `2`). For negative numbers, it rounds towards zero
(e.g. `-1.9` becomes `-1`).

Pass this function as the rounding argument to
[`dangerTransformScale`](/api/conversions/danger-transform-scale),
[`dangerRound`](/api/conversions/danger-round), or
[`dangerDivide`](/api/mutations/danger-divide) to control how remainders are
handled.

## Signature

`(amount: bigint, factor: bigint) => bigint`

## Parameters

| Name     | Type     | Description              | Required |
| -------- | -------- | ------------------------ | -------- |
| `amount` | `bigint` | The amount to divide.    | Yes      |
| `factor` | `bigint` | The factor to divide by. | Yes      |

## Code examples

```ts
import { up } from "jsr:@quarzo-life/moneta";

up(11n, 10n); // 2n   (1.1 → 2)
up(-19n, 10n); // -1n (-1.9 → -1)
```

```ts
import { dangerTransformScale, money, up, USD } from "jsr:@quarzo-life/moneta";

const m = money({ amount: 10455n, currency: USD, scale: 3 });

dangerTransformScale(m, 2, up); // a Money object with amount 1046n and scale 2
```
