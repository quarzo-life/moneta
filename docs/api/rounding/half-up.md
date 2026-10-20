---
title: halfUp
description: Divide and round to the nearest neighbor, rounding up when exactly halfway.
returns: bigint
---

# halfUp

Divide and round towards the nearest neighbor, rounding up when exactly halfway.

This rounding mode rounds to the nearest integer. When the value is exactly
halfway between two integers (e.g. `1.5`), it rounds up (towards positive
infinity). This is the most commonly taught rounding method.

For example, `1.5` rounds to `2`, `2.5` rounds to `3`, and `-1.5` rounds to
`-1`.

Pass this function as the rounding argument to
[`dangerTransformScale`](/api/conversions/danger-transform-scale),
[`dangerRound`](/api/conversions/danger-round), or
[`dangerDivide`](/api/mutations/danger-divide) to control how remainders are
handled. It's also the strategy [`convert`](/api/conversions/convert) uses
internally to round to the target currency's exponent.

## Signature

`(amount: bigint, factor: bigint) => bigint`

## Parameters

| Name     | Type     | Description              | Required |
| -------- | -------- | ------------------------ | -------- |
| `amount` | `bigint` | The amount to divide.    | Yes      |
| `factor` | `bigint` | The factor to divide by. | Yes      |

## Code examples

```ts
import { halfUp } from "jsr:@quarzo-life/moneta";

halfUp(15n, 10n); // 2n   (1.5 → 2)
halfUp(25n, 10n); // 3n   (2.5 → 3)
halfUp(-15n, 10n); // -1n (-1.5 → -1)
```
