---
title: min
description: Get the minimum value from an array of bigint.
returns: bigint
---

# min

Get the minimum value from an array of `bigint` (exported as `minBigIntArray`).

This is a plain `bigint` utility with no currency awareness — it's the primitive
[`minimum`](/api/comparisons/minimum) uses internally once amounts have been
normalized to the same scale. Prefer `minimum` when working with `Money`
objects.

## Parameters

| Name     | Type                | Description                   | Required |
| -------- | ------------------- | ----------------------------- | -------- |
| `values` | `readonly bigint[]` | The bigint values to compare. | Yes      |

## Throws

- If `values` is empty.

## Code examples

```ts
import { minBigIntArray } from "jsr:@quarzo-life/moneta";

minBigIntArray([150n, 50n, 300n]); // 50n
```
