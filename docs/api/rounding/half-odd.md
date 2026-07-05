---
title: halfOdd
description: Divide and round to the nearest neighbor, rounding to the nearest odd integer when exactly halfway.
returns: bigint
---

# halfOdd

Divide and round towards the nearest neighbor, rounding to the nearest odd
integer when exactly halfway.

This rounding mode rounds to the nearest integer. When the value is exactly
halfway between two integers, it picks the odd one. For non-halfway values, it
behaves the same as [`halfUp`](/api/rounding/half-up).

For example, `1.5` rounds to `1`, `2.5` rounds to `3`, `3.5` rounds to `3`, and
`-2.5` rounds to `-3`.

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
import { halfOdd } from "jsr:@quarzo-life/moneta";

halfOdd(15n, 10n); // 1n   (1.5 → 1, odd)
halfOdd(25n, 10n); // 3n   (2.5 → 3, odd)
halfOdd(35n, 10n); // 3n   (3.5 → 3, odd)
halfOdd(-25n, 10n); // -3n (-2.5 → -3, odd)
```
