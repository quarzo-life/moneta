---
title: Money
description: The Money object — Moneta's core data structure.
---

# Money

A `Money` object represents a monetary value (e.g. 51,20 EUR). It's plain,
immutable data: an integer `amount` in the smallest subdivision of a `currency`,
plus a `scale` for precision.

```ts
type Money = Readonly<{
  amount: bigint;
  currency: Currency;
  scale: number;
  toJSON: () => { amount: string; currency: string; scale: number };
}>;
```

You never construct a `Money` literal by hand — always go through
[`money()`](/api/money), which validates its inputs and freezes the result:

```ts
import { EUR, money } from "jsr:@quarzo-life/moneta";

const m = money({ amount: 500n, currency: EUR }); // 5,00 EUR
```

A `Money` object is built from three pieces of domain data, each covered in its
own page:

- [**Amount**](#amount) — the integer value, in the smallest subdivision of the
  currency.
- [**Currency**](/core-concepts/currency) — the code, base, and exponent that
  give the amount meaning.
- [**Scale**](/core-concepts/scale) — the precision at which the amount is
  expressed.

## Amount

The amount is expressed in the smallest subdivision of the currency, as a
`bigint`. For example, 50 EUR equals 5,000 cents:

```ts
import { EUR, money } from "jsr:@quarzo-life/moneta";

const m = money({ amount: 5000n, currency: EUR });
```

`money()` also accepts `number` and `string` for convenience — see
[Why bigint?](/faq/why-bigint) for the validation rules and trade-offs of each
form.

When a currency has no minor unit (like the Japanese yen, exponent `0`), express
the amount directly in major units:

```ts
import { JPY, money } from "jsr:@quarzo-life/moneta";

// This represents ¥5,000
const m = money({ amount: 5000n, currency: JPY });
```

## Immutability

Every `Money` object is frozen by `money()`. Functions that transform a `Money`
object — [mutations](/core-concepts/mutations),
[conversions](/api/conversions/convert), [formatting](/core-concepts/formatting)
— always return a **new** object; they never modify the one you passed in.

```ts
import { add, money, USD } from "jsr:@quarzo-life/moneta";

const m = money({ amount: 500n, currency: USD });

add(m, money({ amount: 100n, currency: USD }));

m.amount; // still 500n — unchanged
```

## Serializing

`Money.toJSON()` is called implicitly by `JSON.stringify(m)`. Because `bigint`
isn't natively JSON-serializable, `amount` is serialized as a string with a
trailing `n` (e.g. `"500n"`). Use [`parse`](/api/conversions/parse) to rebuild a
`Money` object from that string. See the
[Serialization guide](/guides/serialization) for the full round-trip.
