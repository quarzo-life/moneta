---
title: subtract
description: Subtract two Money objects.
returns: Money
---

# subtract

Subtract two Money objects.

**You can only subtract objects that share the same currency.** The function
also normalizes objects to the same [scale](/core-concepts/scale) (the highest)
before subtracting them.

## Parameters

| Name     | Type    | Description                        | Required |
| -------- | ------- | ---------------------------------- | -------- |
| `first`  | `Money` | The Money object to subtract from. | Yes      |
| `second` | `Money` | The Money object to subtract.      | Yes      |

## Throws

- If `first` and `second` don't share the same currency.

## Code examples

### Subtract two objects

```ts
import { money, subtract, USD } from "jsr:@quarzo-life/moneta";

const first = money({ amount: 500n, currency: USD });
const second = money({ amount: 100n, currency: USD });

subtract(first, second); // a Money object with amount 400n
```

### Subtract objects with a different scale

```ts
import { money, subtract, USD } from "jsr:@quarzo-life/moneta";

const first = money({ amount: 500n, currency: USD });
const second = money({ amount: 1000n, currency: USD, scale: 3 });

subtract(first, second); // a Money object with amount 4000n and scale 3
```

### Subtract more than two objects

`subtract` takes exactly two objects, so reduce over an array to subtract more
than two.

```ts
import { money, subtract, USD } from "jsr:@quarzo-life/moneta";
import type { Money } from "jsr:@quarzo-life/moneta";

const first = money({ amount: 400n, currency: USD });
const second = money({ amount: 200n, currency: USD });
const third = money({ amount: 100n, currency: USD });

const subtractMany = (subtrahends: Money[]) => subtrahends.reduce(subtract);

subtractMany([first, second, third]); // a Money object with amount 100n
```
