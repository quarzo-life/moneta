---
title: Currency
description: Passing a currency to a new Money object.
---

# Currency

The currency is one of the three pieces of domain data necessary to create a
[`Money`](/core-concepts/money) object.

A `Currency` is composed of:

```ts
type Currency = {
  readonly code: string;
  readonly base: number | readonly number[];
  readonly exponent: number;
};
```

## Currency code

The code is a **unique identifier for the currency** — not necessarily ISO 4217.
It's your choice as long as it's unique in your application; Moneta compares
currencies by value (`code`, `base`, and `exponent`), not by object identity.

```ts
const USD = {
  code: "USD",
  // ...
};
```

## Currency base

The base (or radix) is the number of unique digits used to represent the
currency's minor unit. Most currencies in circulation are decimal, so their base
is `10`.

```ts
const USD = { code: "USD", base: 10, exponent: 2 };
```

Some currencies are non-decimal. Malagasy ariary (`MGA`), included as a
[built-in currency](/api/currencies), has a base of `5`. Others have multiple
subdivisions — pre-decimal Great Britain pound sterling was divided into 20
shillings, and each shilling into 12 pence:

```ts
const preDecimalGBP = {
  code: "GBP",
  base: [20, 12],
  exponent: 1,
};
```

Internally, Moneta reduces an array base to a single radix by multiplying its
elements (`20 * 12 = 240`) whenever it needs to convert between scales. See the
[Non-decimal currencies guide](/guides/non-decimal-currencies) for how this
affects formatting.

## Currency exponent

The exponent expresses the decimal relationship between the currency and its
minor unit — the number of digits after the decimal separator in the currency's
conventional unit. There are 100 cents in a US dollar (10²), so the USD exponent
is `2`:

```ts
const USD = { code: "USD", base: 10, exponent: 2 };
```

When a currency has no minor unit (like the Japanese yen), the exponent is `0`:

```ts
const JPY = { code: "JPY", base: 10, exponent: 0 };
```

`money()` uses the currency's exponent as the default
[scale](/core-concepts/scale) when you don't specify one explicitly.

## Using built-in currencies

Moneta provides a handful of currencies out of the box — see the full list on
the [Currencies API page](/api/currencies):

```ts
import { EUR, money, USD } from "jsr:@quarzo-life/moneta";

const first = money({ amount: 1000n, currency: USD });
const second = money({ amount: 1000n, currency: EUR });
```

`money()` also accepts a known currency code as a plain string, resolved through
the `CURRENCIES` registry:

```ts
import { money } from "jsr:@quarzo-life/moneta";

const m = money({ amount: 1000n, currency: "USD" });
```

## Creating custom currencies

Any object matching the `Currency` shape works — you don't need to register it
anywhere:

```ts
import { money } from "jsr:@quarzo-life/moneta";
import type { Currency } from "jsr:@quarzo-life/moneta";

const FRF: Currency = { code: "FRF", base: 10, exponent: 2 };

const m = money({ amount: 1000n, currency: FRF });
```

This is also how you'd represent [cryptocurrencies](/guides/cryptocurrencies) or
any currency not in the built-in list — see the
[Adding a new currency guide](/guides/adding-a-currency) for the difference
between a one-off custom currency and contributing one to the built-in registry.
