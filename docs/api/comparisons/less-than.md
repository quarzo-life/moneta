---
title: lessThan
description: Check whether the value of a Money object is less than another.
returns: boolean
---

# lessThan

Check whether the value of a Money object is less than another.

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
import { lessThan, money, USD } from "jsr:@quarzo-life/moneta";

const first = money({ amount: 500n, currency: USD });
const second = money({ amount: 800n, currency: USD });

lessThan(first, second); // true
```
