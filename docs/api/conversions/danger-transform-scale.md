---
title: dangerTransformScale
description: Transform a Money object to a new scale, rounding when the scale shrinks.
returns: Money
---

# dangerTransformScale

Transform a Money object to a new [scale](/core-concepts/scale), rounding when
the scale shrinks.

::: warning Danger When transforming to a smaller scale, the dropped digits are
permanently lost. Use [`rescaleExact`](/api/conversions/rescale-exact) if the
transformation must never discard a non-zero digit. :::

When transforming to a higher scale, the internal `amount` increases by orders
of magnitude and no precision is lost — prefer
[`rescaleExact`](/api/conversions/rescale-exact) for that case, which states the
intent. The [rounding strategy](/api/rounding/down) must be provided explicitly
— there is no default — to make the loss of precision a deliberate choice.

## Parameters

| Name           | Type              | Description                                     | Required |
| -------------- | ----------------- | ----------------------------------------------- | -------- |
| `monetaObject` | `Money`           | The Money object to transform.                  | Yes      |
| `newScale`     | `number`          | The new scale (non-negative integer).           | Yes      |
| `divide`       | `DivideOperation` | The rounding function used when reducing scale. | Yes      |

## Code examples

### Reduce the scale, choosing the rounding

```ts
import {
  dangerTransformScale,
  down,
  money,
  up,
  USD,
} from "jsr:@quarzo-life/moneta";

const m = money({ amount: 10455n, currency: USD, scale: 3 }); // $10.455

dangerTransformScale(m, 2, up); // a Money object with amount 1046n and scale 2
dangerTransformScale(m, 2, down); // a Money object with amount 1045n and scale 2
```
