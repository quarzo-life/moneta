---
title: halfEven
description: Divide and round to the nearest neighbor, rounding to the nearest even integer when exactly halfway.
returns: bigint
---

# halfEven

Divide and round towards the nearest neighbor, rounding to the nearest even
integer when exactly halfway.

This rounding mode is also known as **banker's rounding**. It rounds to the
nearest integer, and when the value is exactly halfway between two integers, it
picks the even one. This reduces cumulative rounding bias when applied
repeatedly across many financial calculations, because it rounds up and down
roughly equally often instead of always favoring one direction.

For example, `1.5` rounds to `2`, `2.5` rounds to `2`, `3.5` rounds to `4`, and
`-2.5` rounds to `-2`.

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
import { halfEven } from "jsr:@quarzo-life/moneta";

halfEven(15n, 10n); // 2n   (1.5 → 2, even)
halfEven(25n, 10n); // 2n   (2.5 → 2, even)
halfEven(35n, 10n); // 4n   (3.5 → 4, even)
halfEven(-25n, 10n); // -2n (-2.5 → -2, even)
```
