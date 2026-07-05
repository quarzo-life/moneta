---
title: Adding a new currency
description: Using a one-off custom currency versus contributing a new built-in currency to Moneta.
---

# Adding a new currency

Moneta ships a small set of [built-in currencies](/api/currencies) — enough to
cover common cases and the library's own tests. For anything else, you have two
options depending on whether the currency is specific to your application or
generally useful.

## Option 1: a one-off custom currency

Any object matching the [`Currency`](/core-concepts/currency) shape works with
`money()` — you don't need to register it anywhere:

```ts
import { money } from "jsr:@quarzo-life/moneta";
import type { Currency } from "jsr:@quarzo-life/moneta";

const FRF: Currency = { code: "FRF", base: 10, exponent: 2 };

const m = money({ amount: 1000n, currency: FRF });
```

This is the right choice for a currency that's specific to your application — a
discontinued national currency, an internal points system, or a
[cryptocurrency](/guides/cryptocurrencies). Define it once, near where you use
it, and pass it around like any other `Currency`.

Keep in mind that `money()` only accepts a **currency code string** (like
`"EUR"`) if it's already registered in Moneta's built-in `CURRENCIES` — for a
custom currency, always pass the `Currency` object itself.

## Option 2: contributing a built-in currency

If a currency is missing from the built-in list and would be broadly useful, it
can be added to Moneta itself. Each currency lives in its own tiny module under
`src/currencies/`:

```ts
// src/currencies/frf.ts
import type { Currency } from "types/types.ts";

/**
 * French franc.
 */
export const FRF: Currency = {
  code: "FRF",
  base: 10,
  exponent: 2,
};
```

It then needs to be wired into `src/currencies/index.ts` — both the `CURRENCIES`
registry object and the named re-export, otherwise `money({ currency: "FRF" })`
(string form) won't resolve it and the currency won't be part of the public
`CurrencyCode` union:

```ts
import { FRF } from "./frf.ts";
// ...
export const CURRENCIES = { /* ..., */ FRF };
export { /* ..., */ FRF };
```

This is a source change to the library itself, not something you do from
application code — open a pull request against the
[Moneta repository](https://github.com/quarzo-life/moneta) if you'd like to
propose one.
