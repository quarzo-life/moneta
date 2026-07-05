---
title: Formatting
description: Formatting Money objects into decimal strings, units, or plain snapshots.
---

# Formatting

When it's time to display an amount, or hand it off to something that isn't
`Money`-aware, the API provides functions to format `Money` objects.

```ts
import { money, toUnits, USD } from "jsr:@quarzo-life/moneta";

const m = money({ amount: 1055n, currency: USD });

toUnits(m); // [10n, 55n]
```

## Displaying an object

[`toDecimal`](/api/formatting/to-decimal) returns a pre-formatted decimal string
and gives you the object's `currency` in a transformer function, so you can
display it however you want:

```ts
import { MGA, money, toDecimal, toUnits, USD } from "jsr:@quarzo-life/moneta";

const usd = money({ amount: 1055n, currency: USD });
const mga = money({ amount: 13n, currency: MGA });

toDecimal(usd, ({ value, currency }) => `${currency.code} ${value}`); // "USD 10.55"
toUnits(usd, ({ value }) => `${value[0]} dollars, ${value[1]} cents`); // "10 dollars, 55 cents"

toUnits(mga, ({ value }) => `${value[0]} ariary, ${value[1]} iraimbilanja`); // "2 ariary, 3 iraimbilanja"
```

`toDecimal` picks up the object's [scale](/core-concepts/scale) to determine how
many decimal places to show — but only for single-based, decimal (base-10)
currencies. Use [`toUnits`](/api/formatting/to-units) instead for
[non-decimal currencies](/guides/non-decimal-currencies) with multiple
subdivisions.

## No currency symbols

Neither function adds a currency symbol or applies locale-aware formatting
(`$10.50` vs. `10,50 €`) — that's left to you, typically via `Intl.NumberFormat`
inside a transformer. See [Why no built-in formatter?](/faq/why-no-formatter)
for the reasoning.

```ts
import { money, toDecimal, USD } from "jsr:@quarzo-life/moneta";

const m = money({ amount: 5000n, currency: USD });

toDecimal(
  m,
  ({ value, currency }) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.code,
    })
      .format(Number(value)),
); // "$50.00"
```

## Retrieving raw data

[`toSnapshot`](/api/formatting/to-snapshot) exposes a `Money` object's raw
`amount`, `currency`, and `scale` as a plain object — useful for inspecting an
object while debugging or writing tests, or as an input to your own transport
format.

```ts
import { money, toSnapshot, USD } from "jsr:@quarzo-life/moneta";

const m = money({ amount: 5000n, currency: USD });

toSnapshot(m); // { amount: 5000n, currency: USD, scale: 2 }
```

`toSnapshot`'s output still contains a raw `bigint`, so it isn't directly
JSON-serializable — for storage or transport, use `JSON.stringify(m)` (backed by
`Money.toJSON()`) and [`parse`](/api/conversions/parse) instead. See the
[Serialization guide](/guides/serialization).
