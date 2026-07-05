---
title: down
description: Divide and round towards negative infinity.
returns: bigint
---

# down

Divide and round towards negative infinity.

This rounding mode always rounds down, regardless of the fractional part. For
positive numbers, it truncates the decimal (e.g. `1.1` becomes `1`, `1.9`
becomes `1`). For negative numbers, it rounds away from zero (e.g. `-1.1`
becomes `-2`).

This is the default rounding mode used by
[`transformScale`](/api/conversions/transform-scale).

Pass this function as the rounding argument to
[`multiply`](/api/mutations/multiply), [`allocate`](/api/mutations/allocate),
[`transformScale`](/api/conversions/transform-scale),
[`dangerDivide`](/api/mutations/danger-divide), or
[`dangerRound`](/api/conversions/danger-round) to control how remainders are
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
import { down } from "jsr:@quarzo-life/moneta";

down(19n, 10n); // 1n   (1.9 → 1)
down(-19n, 10n); // -2n (-1.9 → -2)
```

```ts
import { down, money, transformScale, USD } from "jsr:@quarzo-life/moneta";

const m = money({ amount: 10455n, currency: USD, scale: 3 });

transformScale(m, 2, down); // a Money object with amount 1045n and scale 2
```
