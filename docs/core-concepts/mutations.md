---
title: Mutations
description: Transforming Money objects through mathematical operations.
---

# Mutations

At the core of manipulating money are mutations. The API provides functions to
transform `Money` objects — most of them arithmetic: adding, subtracting,
multiplying, allocating.

```ts
import { add, money, USD } from "jsr:@quarzo-life/moneta";

const d1 = money({ amount: 500n, currency: USD });
const d2 = money({ amount: 800n, currency: USD });

add(d1, d2);
```

## Calculating new amounts

A classic example is a checkout page: computing a subtotal, applying a discount,
adding shipping.

```ts
import {
  add,
  allocate,
  money,
  subtract,
  USD,
  zeroMoney,
} from "jsr:@quarzo-life/moneta";

const products = [
  { name: "Widget", price: money({ amount: 8990n, currency: USD }) },
  { name: "Gadget", price: money({ amount: 1749n, currency: USD }) },
];

const subtotal = products.reduce(
  (acc, { price }) => add(acc, price),
  zeroMoney(USD),
);

const [discount] = allocate(subtotal, [20, 80]);
const discounted = subtract(subtotal, discount);

const shipping = money({ amount: 1000n, currency: USD });

const total = add(discounted, shipping);
```

## Money objects are immutable

Even though these functions perform "mutations" conceptually, `Money` objects
themselves are immutable. Calling a mutation function never modifies its inputs
— it always returns a new object.

```ts
import { add, money, toSnapshot, USD } from "jsr:@quarzo-life/moneta";

const d1 = money({ amount: 500n, currency: USD });
const d2 = money({ amount: 800n, currency: USD });

toSnapshot(add(d1, d2)); // { amount: 1300n, currency: USD, scale: 2 }
toSnapshot(d1); // { amount: 500n, currency: USD, scale: 2 } — unchanged
toSnapshot(d2); // { amount: 800n, currency: USD, scale: 2 } — unchanged
```

## No floats, ever

None of the mutation functions accept a `number` multiplier or ratio with a
fractional part — you always pass a plain integer or a
[scaled amount](/core-concepts/scale) (`{ amount: bigint, scale: number }`).
This is the same rule that governs amounts themselves: see
[Why bigint?](/faq/why-bigint) for the reasoning.

```ts
import { EUR, money, multiply } from "jsr:@quarzo-life/moneta";

const m = money({ amount: 401n, currency: EUR });

// Instead of multiply(m, 2.1) — pass a scaled amount
multiply(m, { amount: 21n, scale: 1 }); // a Money object with amount 8421n and scale 3
```

## Rounding is always explicit for lossy operations

`multiply`, `allocate`, and `transformScale` never lose money silently —
`allocate` distributes remainders fairly, and `transformScale` defaults to
rounding down (`down`) when reducing scale, but lets you pass any other
[rounding strategy](/api/rounding/down).

Two operations go further and are named accordingly:
[`dangerDivide`](/api/mutations/danger-divide) and
[`dangerRound`](/api/conversions/danger-round) permanently discard the
remainder, and force you to pick a rounding strategy explicitly — there's no
default. See the [Danger-prefixed operations guide](/guides/danger-operations)
for the full rationale.
