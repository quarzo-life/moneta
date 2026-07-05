---
title: add
description: Add up two Money objects.
returns: Money
---

# add

Add up two Money objects.

**You can only add objects that share the same currency.** The function also
normalizes objects to the same [scale](/core-concepts/scale) (the highest)
before adding them up.

## Parameters

| Name     | Type    | Description                 | Required |
| -------- | ------- | --------------------------- | -------- |
| `first`  | `Money` | The Money object to add to. | Yes      |
| `second` | `Money` | The Money object to add.    | Yes      |

## Throws

- If `first` and `second` don't share the same currency.

## Code examples

### Add two objects

```ts
import { add, money, USD } from "jsr:@quarzo-life/moneta";

const first = money({ amount: 500n, currency: USD });
const second = money({ amount: 100n, currency: USD });

add(first, second); // a Money object with amount 600n
```

### Add objects with a different scale

```ts
import { add, money, USD } from "jsr:@quarzo-life/moneta";

const first = money({ amount: 400n, currency: USD });
const second = money({ amount: 104545n, currency: USD, scale: 4 });

add(first, second); // a Money object with amount 144545n and scale 4
```

### Add more than two objects

`add` takes exactly two objects, so reduce over an array to sum more than two.

```ts
import { add, money, USD } from "jsr:@quarzo-life/moneta";
import type { Money } from "jsr:@quarzo-life/moneta";

const first = money({ amount: 300n, currency: USD });
const second = money({ amount: 200n, currency: USD });
const third = money({ amount: 100n, currency: USD });

const addMany = (addends: Money[]) => addends.reduce(add);

addMany([first, second, third]); // a Money object with amount 600n
```
