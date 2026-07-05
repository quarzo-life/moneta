---
title: haveSameAmount
description: Check whether a set of Money objects have the same amount.
returns: boolean
---

# haveSameAmount

Check whether a set of Money objects have the same amount.

Unlike [`equal`](/api/comparisons/equal), this only compares amounts (after
normalizing scales) — it doesn't check currencies.

## Parameters

| Name            | Type                   | Description                   | Required |
| --------------- | ---------------------- | ----------------------------- | -------- |
| `monetaObjects` | `ReadonlyArray<Money>` | The Money objects to compare. | Yes      |

## Code examples

### Compare two objects with different amounts

```ts
import { haveSameAmount, money, USD } from "jsr:@quarzo-life/moneta";

const first = money({ amount: 1000n, currency: USD });
const second = money({ amount: 2000n, currency: USD });

haveSameAmount([first, second]); // false
```

### Compare two objects with the same amount once normalized

```ts
import { haveSameAmount, money, USD } from "jsr:@quarzo-life/moneta";

const first = money({ amount: 1000n, currency: USD });
const second = money({ amount: 10000n, currency: USD, scale: 3 });

haveSameAmount([first, second]); // true
```
