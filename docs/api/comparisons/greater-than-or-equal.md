---
title: greaterThanOrEqual
description: Check whether the value of a Money object is greater than or equal to another.
returns: boolean
---

# greaterThanOrEqual

Check whether the value of a Money object is greater than or equal to another.

**You can only compare objects that share the same currency.** The function also
normalizes objects to the same scale (the highest) before comparing them.

## Parameters

| Name     | Type    | Description                         | Required |
| -------- | ------- | ----------------------------------- | -------- |
| `first`  | `Money` | The first Money object to compare.  | Yes      |
| `second` | `Money` | The second Money object to compare. | Yes      |

## Throws

- If `first` and `second` don't share the same currency.

## Code examples

```ts
import { greaterThanOrEqual, money, USD } from "jsr:@quarzo-life/moneta";

const first = money({ amount: 500n, currency: USD });
const second = money({ amount: 500n, currency: USD });

greaterThanOrEqual(first, second); // true
```
