---
title: minimum
description: Get the lowest of a set of Money objects.
returns: Money
---

# minimum

Get the lowest of a set of Money objects.

**You can only compare objects that share the same currency.** The function also
normalizes objects to the same scale (the highest) before comparing them.

## Parameters

| Name           | Type                   | Description                   | Required |
| -------------- | ---------------------- | ----------------------------- | -------- |
| `moneyObjects` | `ReadonlyArray<Money>` | The Money objects to compare. | Yes      |

## Throws

- If the objects don't all share the same currency.

## Code examples

```ts
import { minimum, money, USD } from "jsr:@quarzo-life/moneta";

const first = money({ amount: 150n, currency: USD });
const second = money({ amount: 50n, currency: USD });

minimum([first, second]); // a Money object with amount 50n
```
