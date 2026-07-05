---
title: multiply
description: Multiply a Money object.
returns: Money
---

# multiply

Multiply a Money object by a scalar multiplier.

If you need to multiply by a fractional multiplier, don't use floats — use a
[`ScaledAmount`](/core-concepts/scale) instead. For example, instead of passing
`2.1`, pass `{ amount: 21n, scale: 1 }`. When using a scaled amount, the
function converts the result to the safest scale (the sum of the operand
scales), and does not round or lose precision.

## Parameters

| Name           | Type                     | Description                                               | Required |
| -------------- | ------------------------ | --------------------------------------------------------- | -------- |
| `multiplicand` | `Money`                  | The Money object to multiply.                             | Yes      |
| `multiplier`   | `ScaledAmount \| number` | The multiplier, either a plain number or a scaled amount. | Yes      |

## Code examples

### Multiply by an integer

```ts
import { EUR, money, multiply } from "jsr:@quarzo-life/moneta";

const m = money({ amount: 400n, currency: EUR });

multiply(m, 4); // a Money object with amount 1600n
```

### Multiply by a scaled multiplier

```ts
import { EUR, money, multiply } from "jsr:@quarzo-life/moneta";

const m = money({ amount: 401n, currency: EUR });

multiply(m, { amount: 2001n, scale: 3 }); // a Money object with amount 802401n and scale 5
```
