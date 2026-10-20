---
title: halfAwayFromZero
description: Divide and round to the nearest neighbor, rounding away from zero when exactly halfway.
returns: bigint
---

# halfAwayFromZero

Divide and round towards the nearest neighbor, rounding away from zero when
exactly halfway.

This rounding mode rounds to the nearest integer. When the value is exactly
halfway between two integers, it rounds away from zero: positive halfway values
round up (e.g. `1.5` becomes `2`), and negative halfway values round down (e.g.
`-1.5` becomes `-2`). For non-halfway values, it behaves the same as
[`halfUp`](/api/rounding/half-up).

This is sometimes referred to as "commercial rounding" or "arithmetic rounding."

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
import { halfAwayFromZero } from "jsr:@quarzo-life/moneta";

halfAwayFromZero(15n, 10n); // 2n  (1.5 → 2)
halfAwayFromZero(-15n, 10n); // -2n (-1.5 → -2)
```
