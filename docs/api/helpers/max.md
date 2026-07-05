---
title: max
description: Get the maximum value from an array of bigint.
returns: bigint
---

# max

Get the maximum value from an array of `bigint` (exported as `maxBigIntArray`).

This is a plain `bigint` utility with no currency awareness — it's the primitive
[`maximum`](/api/comparisons/maximum) uses internally once amounts have been
normalized to the same scale. Prefer `maximum` when working with `Money`
objects.

## Parameters

| Name     | Type                | Description                   | Required |
| -------- | ------------------- | ----------------------------- | -------- |
| `values` | `readonly bigint[]` | The bigint values to compare. | Yes      |

## Throws

- If `values` is empty.

## Code examples

```ts
import { maxBigIntArray } from "jsr:@quarzo-life/moneta";

maxBigIntArray([150n, 50n, 300n]); // 300n
```
