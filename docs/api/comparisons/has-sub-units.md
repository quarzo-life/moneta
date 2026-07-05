---
title: hasSubUnits
description: Check whether a Money object has a non-zero sub-unit amount.
returns: boolean
---

# hasSubUnits

Check whether a Money object has a non-zero sub-unit amount — i.e. whether its
value includes anything beyond whole currency units (e.g. cents for USD, pence
for GBP).

## Parameters

| Name           | Type    | Description                | Required |
| -------------- | ------- | -------------------------- | -------- |
| `monetaObject` | `Money` | The Money object to check. | Yes      |

## Code examples

```ts
import { hasSubUnits, money, USD } from "jsr:@quarzo-life/moneta";

const withCents = money({ amount: 1050n, currency: USD }); // $10.50
const wholeDollars = money({ amount: 1000n, currency: USD }); // $10.00

hasSubUnits(withCents); // true
hasSubUnits(wholeDollars); // false
```
