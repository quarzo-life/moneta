---
title: transformScale
description: Transform a Money object to a new scale.
returns: Money
---

# transformScale

Transform a Money object to a new [scale](/core-concepts/scale).

When transforming to a higher scale, the internal `amount` increases by orders
of magnitude — no precision is lost. When transforming to a smaller scale, the
amount loses precision; the function rounds down (`down`) by default. Pass a
different [`DivideOperation`](/core-concepts/mutations) as the third argument to
control the rounding.

`transformScale` is the primitive most of the other conversions build on
(`normalizeScale`, `trimScale`, `dangerRound`, `convert`, `multiply`,
`allocate`).

## Parameters

| Name           | Type              | Description                                                         | Required |
| -------------- | ----------------- | ------------------------------------------------------------------- | -------- |
| `monetaObject` | `Money`           | The Money object to transform.                                      | Yes      |
| `newScale`     | `number`          | The new scale to transform to.                                      | Yes      |
| `divide`       | `DivideOperation` | The rounding function used when reducing scale. Defaults to `down`. | No       |

## Code examples

### Transform an object to a new scale

```ts
import { money, transformScale, USD } from "jsr:@quarzo-life/moneta";

const m = money({ amount: 500n, currency: USD, scale: 2 });

transformScale(m, 4); // a Money object with amount 50000n and scale 4
```

### Pass a custom rounding strategy

```ts
import { money, transformScale, up, USD } from "jsr:@quarzo-life/moneta";

const m = money({ amount: 10455n, currency: USD, scale: 3 });

transformScale(m, 2, up); // a Money object with amount 1046n and scale 2
```
