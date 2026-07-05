---
title: Non-decimal currencies
description: Working with currencies that don't subdivide by 10, or subdivide into multiple units.
---

# Non-decimal currencies

Most currencies subdivide by 10 — a `base` of `10` — but not all of them. Moneta
supports non-decimal currencies as first-class citizens, as long as you describe
them correctly through the [`Currency`](/core-concepts/currency) shape.

## Currencies with a non-decimal base

[Malagasy ariary](https://en.wikipedia.org/wiki/Malagasy_ariary) (`MGA`,
[built in](/api/currencies)) subdivides into 5 iraimbilanja instead of 100
cents:

```ts
import { MGA, money, toUnits } from "jsr:@quarzo-life/moneta";

const m = money({ amount: 13n, currency: MGA }); // MGA has base: 5, exponent: 1

toUnits(m, ({ value }) => `${value[0]} ariary, ${value[1]} iraimbilanja`);
// "2 ariary, 3 iraimbilanja"
```

## Currencies with multiple subdivisions

Some currencies historically had more than one level of subdivision. Pre-decimal
Great Britain pound sterling was divided into 20 shillings, and each shilling
into 12 pence — expressed with an array `base`:

```ts
import { money, toUnits } from "jsr:@quarzo-life/moneta";
import type { Currency } from "jsr:@quarzo-life/moneta";

const preDecimalGBP: Currency = { code: "GBP", base: [20, 12], exponent: 1 };

const m = money({ amount: 267n, currency: preDecimalGBP });

const labels = ["pounds", "shillings", "pence"];

toUnits(m, ({ value }) =>
  value
    .filter((amount) => amount > 0n)
    .map((amount, index) => `${amount} ${labels[index]}`)
    .join(", ")); // "1 pounds, 2 shillings, 3 pence"
```

`toUnits` returns one bigint per subdivision level, from the largest unit down
to the smallest — that's why the array `base` needs no special handling on your
end beyond a matching `labels` array.

## toDecimal doesn't work here

[`toDecimal`](/api/formatting/to-decimal) assumes a single base-10 subdivision,
because a decimal string can't represent "1 pound, 2 shillings, 3 pence" — it
throws for any currency with an array `base`, or a non-decimal single `base`
(like MGA's `5`):

```ts
import { MGA, money, toDecimal } from "jsr:@quarzo-life/moneta";

const m = money({ amount: 13n, currency: MGA });

toDecimal(m); // throws: Currency is not decimal.
```

Use [`toUnits`](/api/formatting/to-units) with a custom transformer instead, as
shown above — it's the only formatting function that understands multiple
subdivisions.

## Scale still works the same way

[Scale](/core-concepts/scale) transformations
([`transformScale`](/api/conversions/transform-scale),
[`normalizeScale`](/api/conversions/normalize-scale),
[`trimScale`](/api/conversions/trim-scale)) use the currency's `base` internally
to compute the conversion factor — for an array base, Moneta multiplies its
elements together (`20 * 12 = 240`) to get a single radix. You don't need to do
anything differently when mixing non-decimal `Money` objects into `add`,
`subtract`, or the comparison functions; they normalize scales exactly the same
way as decimal currencies.
