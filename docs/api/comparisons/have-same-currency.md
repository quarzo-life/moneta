---
title: haveSameCurrency
description: Check whether a set of Money objects have the same currency.
returns: boolean
---

# haveSameCurrency

Check whether a set of Money objects have the same currency.

Two currencies are considered the same when their `code`, `base`, and `exponent`
all match — this compares by value, not by object identity, so two
separately-constructed `Currency` objects with the same shape are equal.

## Parameters

| Name            | Type                   | Description                   | Required |
| --------------- | ---------------------- | ----------------------------- | -------- |
| `monetaObjects` | `ReadonlyArray<Money>` | The Money objects to compare. | Yes      |

## Code examples

### Compare two objects with the same currency

```ts
import { haveSameCurrency, money, USD } from "jsr:@quarzo-life/moneta";

const first = money({ amount: 1000n, currency: USD });
const second = money({ amount: 2000n, currency: USD });

haveSameCurrency([first, second]); // true
```

### Compare two objects with different currencies

```ts
import { EUR, haveSameCurrency, money, USD } from "jsr:@quarzo-life/moneta";

const first = money({ amount: 1000n, currency: USD });
const second = money({ amount: 10000n, currency: EUR });

haveSameCurrency([first, second]); // false
```
