---
title: equal
description: Check whether the value of a Money object is equal to another.
returns: boolean
---

# equal

Check whether two Money objects are equal.

This is same-value equality: it checks that both objects share the same currency
([`haveSameCurrency`](/api/comparisons/have-same-currency)) and, once normalized
to the same scale, the same amount
([`haveSameAmount`](/api/comparisons/have-same-amount)).

## Parameters

| Name     | Type    | Description                         | Required |
| -------- | ------- | ----------------------------------- | -------- |
| `first`  | `Money` | The first Money object to compare.  | Yes      |
| `second` | `Money` | The second Money object to compare. | Yes      |

## Code examples

### Compare two identical objects

```ts
import { equal, money, USD } from "jsr:@quarzo-life/moneta";

const first = money({ amount: 500n, currency: USD });
const second = money({ amount: 500n, currency: USD });

equal(first, second); // true
```

### Compare two objects with different amounts

```ts
import { equal, money, USD } from "jsr:@quarzo-life/moneta";

const first = money({ amount: 500n, currency: USD });
const second = money({ amount: 800n, currency: USD });

equal(first, second); // false
```

### Compare two identical objects after normalization

```ts
import { equal, money, USD } from "jsr:@quarzo-life/moneta";

const first = money({ amount: 500n, currency: USD });
const second = money({ amount: 5000n, currency: USD, scale: 3 });

equal(first, second); // true
```

### Compare two objects with different currencies

```ts
import { equal, EUR, money, USD } from "jsr:@quarzo-life/moneta";

const first = money({ amount: 500n, currency: USD });
const second = money({ amount: 500n, currency: EUR });

equal(first, second); // false
```
