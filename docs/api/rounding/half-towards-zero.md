---
title: halfTowardsZero
description: Divide and round to the nearest neighbor, rounding towards zero when exactly halfway.
returns: bigint
---

# halfTowardsZero

Divide and round towards the nearest neighbor, rounding towards zero when
exactly halfway.

This rounding mode rounds to the nearest integer. When the value is exactly
halfway between two integers, it rounds towards zero: positive halfway values
round down (e.g. `1.5` becomes `1`), and negative halfway values round up (e.g.
`-1.5` becomes `-1`). For non-halfway values, it behaves the same as
[`halfUp`](/api/rounding/half-up).

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
import { halfTowardsZero } from "jsr:@quarzo-life/moneta";

halfTowardsZero(15n, 10n); // 1n  (1.5 → 1)
halfTowardsZero(-15n, 10n); // -1n (-1.5 → -1)
```
