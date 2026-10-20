---
title: rescaleExact
description: Change a Money object's scale without ever losing precision.
returns: Money
---

# rescaleExact

Change a Money object's [scale](/core-concepts/scale) without ever losing
precision.

- Increasing the scale always succeeds (`1.23` → `1.2300`).
- Decreasing the scale succeeds only when the dropped digits are all zeros
  (`1.2300` → `1.23`). Otherwise it **throws** (`1.234` → scale 2 is refused).
- Without `newScale`, the scale is trimmed as much as possible without loss, but
  never below the currency's exponent.

Use [`dangerTransformScale`](/api/conversions/danger-transform-scale) when
rounding is acceptable.

## Parameters

| Name           | Type     | Description                                                                                                       | Required |
| -------------- | -------- | ----------------------------------------------------------------------------------------------------------------- | -------- |
| `monetaObject` | `Money`  | The Money object to rescale.                                                                                      | Yes      |
| `newScale`     | `number` | The target scale (non-negative integer). Defaults to the smallest lossless scale at or above the currency exponent. | No       |

## Code examples

### Rescale exactly

```ts
import { EUR, money, rescaleExact } from "jsr:@quarzo-life/moneta";

const m = money({ amount: 12300n, currency: EUR, scale: 4 }); // €1.2300

rescaleExact(m, 2); // a Money object with amount 123n and scale 2
rescaleExact(m, 6); // a Money object with amount 1230000n and scale 6
```

### Refuse to lose precision

```ts
import { EUR, money, rescaleExact } from "jsr:@quarzo-life/moneta";

const m = money({ amount: 1234n, currency: EUR, scale: 3 }); // €1.234

rescaleExact(m, 2); // throws "[Money] Rescaling would discard non-zero digits."
```

### Trim down to the smallest lossless scale

If the amount has fewer trailing zeros than the distance to the currency
exponent, the scale only shrinks as far as it safely can.

```ts
import { money, rescaleExact, USD } from "jsr:@quarzo-life/moneta";

rescaleExact(money({ amount: 500000n, currency: USD, scale: 5 })); // amount 500n, scale 2
rescaleExact(money({ amount: 99950n, currency: USD, scale: 4 })); // amount 9995n, scale 3
```
