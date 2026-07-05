---
title: trimScale
description: Trim a Money object's scale down to the currency exponent when possible.
returns: Money
---

# trimScale

Trim a Money object's [scale](/core-concepts/scale) as much as possible, down to
the currency's exponent.

`trimScale` only removes trailing zeros from the amount — unlike
[`dangerRound`](/api/conversions/danger-round), it never discards significant
digits, so it's always safe to call.

## Parameters

| Name           | Type    | Description               | Required |
| -------------- | ------- | ------------------------- | -------- |
| `monetaObject` | `Money` | The Money object to trim. | Yes      |

## Code examples

### Trim an object down to its currency exponent's scale

```ts
import { EUR, money, trimScale } from "jsr:@quarzo-life/moneta";

const m = money({ amount: 500000n, currency: EUR, scale: 5 });

trimScale(m); // a Money object with amount 500n and scale 2
```

### Trim an object down to the safest possible scale

If the amount has fewer trailing zeros than the distance to the currency
exponent, the scale only shrinks as far as it safely can.

```ts
import { money, trimScale, USD } from "jsr:@quarzo-life/moneta";

const m = money({ amount: 99950n, currency: USD, scale: 4 });

trimScale(m); // a Money object with amount 9995n and scale 3
```
