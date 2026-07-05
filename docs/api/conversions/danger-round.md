---
title: dangerRound
description: Round a Money object to its currency's conventional scale.
returns: Money
---

# dangerRound

Round a Money object to its currency's conventional scale (the exponent).

::: warning Danger Sub-unit precision beyond the currency exponent is
permanently lost. For example, rounding a USD object at scale 3 to scale 2
discards the thousandths-of-a-cent digit with no way to recover it. :::

If the object's scale is already at or below the currency exponent, it's
returned unchanged (no-op). The rounding strategy must be provided explicitly —
there is no default — to make the loss of precision a deliberate choice.

## Parameters

| Name           | Type              | Description                                                                      | Required |
| -------------- | ----------------- | -------------------------------------------------------------------------------- | -------- |
| `monetaObject` | `Money`           | The Money object to round.                                                       | Yes      |
| `divideOp`     | `DivideOperation` | The [rounding strategy](/core-concepts/mutations) applied to the dropped digits. | Yes      |

## Code examples

### Round to cents (USD exponent = 2)

```ts
import {
  dangerRound,
  down,
  halfUp,
  money,
  up,
  USD,
} from "jsr:@quarzo-life/moneta";

const m = money({ amount: 12345n, currency: USD, scale: 3 }); // $12.345

dangerRound(m, down); // amount: 1234n, scale: 2 ($12.34 — $0.005 lost)
dangerRound(m, up); // amount: 1235n, scale: 2 ($12.35 — $0.005 lost)
dangerRound(m, halfUp); // amount: 1235n, scale: 2 ($12.35)
```

### No-op when already at or below the currency exponent

```ts
import { dangerRound, down, money, USD } from "jsr:@quarzo-life/moneta";

const m = money({ amount: 1000n, currency: USD, scale: 2 }); // $10.00

dangerRound(m, down); // returns m unchanged
```

### Round to whole units (JPY exponent = 0)

```ts
import { dangerRound, down, JPY, money, up } from "jsr:@quarzo-life/moneta";

const m = money({ amount: 12345n, currency: JPY, scale: 2 }); // ¥123.45

dangerRound(m, down); // amount: 123n, scale: 0 (¥123 — ¥0.45 lost)
dangerRound(m, up); // amount: 124n, scale: 0 (¥124)
```
