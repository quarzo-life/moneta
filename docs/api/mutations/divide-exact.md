---
title: divideExact
description: Divide a Money object by a scalar divisor, without any rounding.
returns: Money
---

# divideExact

Divide a Money object by a scalar divisor, without any rounding.

The result keeps the [scale](/core-concepts/scale) of the input, and grows it
only as much as needed to represent the quotient exactly — the same way
[`multiply`](/api/mutations/multiply) grows the scale instead of rounding. If
the quotient has no finite representation in the currency's base (e.g. `1 / 3`
in base 10), it **throws**.

Use [`dangerDivide`](/api/mutations/danger-divide) when rounding is acceptable,
[`allocate`](/api/mutations/allocate) to split an amount between recipients, and
[`rescaleExact`](/api/conversions/rescale-exact) to bring the result back to a
given scale without loss.

## Parameters

| Name           | Type                               | Description                                                          | Required |
| -------------- | ---------------------------------- | -------------------------------------------------------------------- | -------- |
| `monetaObject` | `Money`                            | The Money object to divide.                                          | Yes      |
| `divisor`      | `ScaledAmount \| number \| bigint` | The value to divide by. Use a scaled amount for fractional divisors. | Yes      |

## Code examples

### Exact division at the same scale

```ts
import { divideExact, money, USD } from "jsr:@quarzo-life/moneta";

divideExact(money({ amount: 1000n, currency: USD }), 4); // amount: 250n, scale: 2 ($2.50)
```

### The scale grows when needed

```ts
import { divideExact, money, USD } from "jsr:@quarzo-life/moneta";

divideExact(money({ amount: 100n, currency: USD }), 8); // amount: 125n, scale: 3 ($0.125)
```

### Non-terminating quotients throw

```ts
import { divideExact, money, USD } from "jsr:@quarzo-life/moneta";

divideExact(money({ amount: 100n, currency: USD }), 3); // throws "[Money] Division has no exact result in the currency base."
```

### Exact to the cent

Chain with [`rescaleExact`](/api/conversions/rescale-exact) to require an exact
result at the currency's scale:

```ts
import { divideExact, money, rescaleExact, USD } from "jsr:@quarzo-life/moneta";

rescaleExact(divideExact(money({ amount: 1000n, currency: USD }), 8), 2); // $10.00 / 8 = $1.25 → amount: 125n, scale: 2
rescaleExact(divideExact(money({ amount: 100n, currency: USD }), 8), 2); // $1.00 / 8 = $0.125 → throws
```
