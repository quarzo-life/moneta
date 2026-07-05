---
title: Scale
description: Passing a scale to a new Money object.
---

# Scale

The scale is one of the three pieces of domain data necessary to create a
[`Money`](/core-concepts/money) object. It's conceptually close to the
[currency exponent](/core-concepts/currency#currency-exponent), but expresses
precision as accurately as possible for a given value — independently of what
the currency's conventional display precision is.

Most of the time, you don't need to specify the scale. It defaults to the
currency's exponent:

```ts
import { money, USD } from "jsr:@quarzo-life/moneta";

const m = money({ amount: 5000n, currency: USD });

m.scale; // 2 — picked up USD.exponent
```

## Why not just use the currency exponent?

You may think of money as its value in major or minor units — the value you can
actually pay — but calculations often need a more precise intermediate
representation. A common example is tax: rates are often fractional. An item at
EUR 19.95 with a 5.5% VAT rate results in a final price of EUR 21.04725. That
value gets rounded when it's time to pay, but **precision must be preserved
until the end of the calculation**, especially across many operations.

The scale exists to represent monetary values accurately without losing
precision along the way. It adapts automatically as calculations require more
digits.

```ts
import { add, EUR, money, multiply } from "jsr:@quarzo-life/moneta";

const price = money({ amount: 1995n, currency: EUR });
const tax = multiply(price, { amount: 55n, scale: 3 }); // 5.5% == 0.055
const total = add(price, tax);

total.amount; // 2104725n
total.scale; // 5
```

`total` transparently grew to a scale of 5 to preserve the extra precision from
the tax calculation. Interpreted at that scale, `2104725n` means 21.04725 — not
21047.25.

Note the multiplier itself: to calculate 5.5% (0.055), we pass
`{ amount: 55n, scale: 3 }` instead of a float. See
[Mutations](/core-concepts/mutations) for why floats are avoided throughout the
API.

## When to specify a scale manually

Occasionally you need more precision than the currency exponent provides.
Imagine selling hardware by the kit — 250 screws for $8.75 — but still needing
to express the price of a single screw for admin purposes. That's $0.035, which
can't be represented with two digits:

```ts
import { money, USD } from "jsr:@quarzo-life/moneta";

const price = money({ amount: 35n, currency: USD, scale: 3 });
```

## Calculating objects of different scales

When you combine two `Money` objects, you don't have to think about their scale
— binary operations [normalize](/api/conversions/normalize-scale) to the higher
of the two scales first, so no precision is lost:

```ts
import { add, money, subtract, USD } from "jsr:@quarzo-life/moneta";

const d1 = money({ amount: 400n, currency: USD });
const d2 = money({ amount: 104545n, currency: USD, scale: 4 });

add(d1, d2); // a Money object with amount 144545n and scale 4
subtract(d2, d1); // a Money object with amount 64545n and scale 4
```

When you need a fractional multiplier or ratio (a tax rate, a conversion rate,
an allocation percentage), don't use a float — pass a scaled amount instead.
Instead of `0.82`, pass `{ amount: 82n, scale: 2 }`:

```ts
import { money, multiply, USD } from "jsr:@quarzo-life/moneta";

const m = money({ amount: 400n, currency: USD });

multiply(m, { amount: 82n, scale: 2 }); // a Money object with amount 32800n and scale 4
```

## Trimming scale

Because calculations favor the safest scale, results can end up carrying more
precision than they actually need — trailing zeros that could be dropped without
losing anything:

```ts
import { add, money, trimScale, USD } from "jsr:@quarzo-life/moneta";

const d1 = money({ amount: 100n, currency: USD });
const d2 = money({ amount: 2000000n, currency: USD, scale: 6 });

const d3 = add(d1, d2); // a Money object with amount 3000000n and scale 6

trimScale(d3); // a Money object with amount 300n and scale 2
```

[`trimScale`](/api/conversions/trim-scale) only removes trailing zeros — it
never discards significant digits, and never trims below the currency's exponent
— so it's always safe to call. Compare this with
[`dangerRound`](/api/conversions/danger-round) and the
[Danger-prefixed operations guide](/guides/danger-operations), which _do_
discard precision and require you to choose how.
