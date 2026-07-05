---
title: halfDown
description: Divide and round to the nearest neighbor, rounding down when exactly halfway.
returns: bigint
---

# halfDown

Divide and round towards the nearest neighbor, rounding down when exactly
halfway.

This rounding mode rounds to the nearest integer. When the value is exactly
halfway between two integers (e.g. `1.5`), it rounds down (towards negative
infinity). For non-halfway values, it behaves the same as
[`halfUp`](/api/rounding/half-up).

For example, `1.5` rounds to `1`, `2.5` rounds to `2`, and `-1.5` rounds to
`-2`.

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
import { halfDown } from "jsr:@quarzo-life/moneta";

halfDown(15n, 10n); // 1n   (1.5 → 1)
halfDown(25n, 10n); // 2n   (2.5 → 2)
halfDown(-15n, 10n); // -2n (-1.5 → -2)
```
