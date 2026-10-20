---
title: dangerDivide
description: Divide a Money object by a scalar divisor, discarding the remainder.
returns: Money
---

# dangerDivide

Divide a Money object by a scalar divisor.

::: warning Danger The remainder is permanently discarded. Use
[`allocate`](/api/mutations/allocate) instead if you need to distribute the
remainder fairly across recipients. :::

The `danger` prefix marks operations that silently lose precision. There is no
default rounding strategy — you must always pass one explicitly, so the loss is
a deliberate choice.

The result is rounded once, directly at the requested `scale` — there's no
intermediate rounding. Use [`divideExact`](/api/mutations/divide-exact) when the
division must not lose anything.

The divisor may be negative (the rounding strategy keeps its meaning, e.g.
`down` still rounds towards negative infinity). A zero divisor throws
`[Money] Cannot divide by zero.`

## Parameters

| Name           | Type                               | Description                                                                          | Required |
| -------------- | ---------------------------------- | ------------------------------------------------------------------------------------ | -------- |
| `monetaObject` | `Money`                            | The Money object to divide.                                                          | Yes      |
| `divisor`      | `ScaledAmount \| number \| bigint` | The value to divide by. Use a scaled amount for fractional divisors.                 | Yes      |
| `divideOp`     | `DivideOperation`                  | The [rounding strategy](/core-concepts/mutations) applied when division isn't exact. | Yes      |
| `scale`        | `number`                           | The scale of the result. Defaults to the scale of `monetaObject`.                    | No       |

## Code examples

### Divide by an integer

```ts
import { dangerDivide, down, money, USD } from "jsr:@quarzo-life/moneta";

const m = money({ amount: 1000n, currency: USD }); // $10.00

dangerDivide(m, 3, down); // amount: 333n, scale: 2 ($3.33 — $0.01 lost)
```

### Divide by a bigint

```ts
import { dangerDivide, down, money, USD } from "jsr:@quarzo-life/moneta";

const m = money({ amount: 1000n, currency: USD }); // $10.00

dangerDivide(m, 4n, down); // amount: 250n, scale: 2 ($2.50 — exact, no loss)
```

### Divide by a fractional ScaledAmount

```ts
import { dangerDivide, down, money, USD } from "jsr:@quarzo-life/moneta";

const m = money({ amount: 1000n, currency: USD }); // $10.00

// Dividing by 0.5 is equivalent to multiplying by 2
dangerDivide(m, { amount: 5n, scale: 1 }, down); // amount: 2000n, scale: 2 ($20.00)

// Dividing by 0.3
dangerDivide(m, { amount: 3n, scale: 1 }, down); // amount: 3333n, scale: 2 ($33.33 — a fraction of a cent lost)
```

### Choose a rounding strategy

```ts
import {
  dangerDivide,
  down,
  halfUp,
  money,
  up,
  USD,
} from "jsr:@quarzo-life/moneta";

const m = money({ amount: 1000n, currency: USD }); // $10.00

dangerDivide(m, 3, down); // amount: 333n ($3.33)
dangerDivide(m, 3, up); // amount: 334n ($3.34)
dangerDivide(m, 3, halfUp); // amount: 333n ($3.33)
```

### Choose the scale of the result

```ts
import { dangerDivide, halfEven, money, USD } from "jsr:@quarzo-life/moneta";

const m = money({ amount: 1000n, currency: USD }); // $10.00

dangerDivide(m, 3, halfEven, 4); // amount: 33333n, scale: 4 ($3.3333)
dangerDivide(m, 3, halfEven, 0); // amount: 3n, scale: 0 ($3)
```
