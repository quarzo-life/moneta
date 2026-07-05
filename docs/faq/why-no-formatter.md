---
title: Why no built-in formatter?
description: Why Moneta doesn't format amounts with currency symbols and how to do it yourself.
---

# Why no built-in formatter?

[`toDecimal`](/api/formatting/to-decimal) returns a plain decimal string like
`"10.50"`, not `"$10.50"` or `"10,50 €"`. Moneta doesn't ship a currency-symbol
formatter, and earlier versions of the library that did had it removed.

Locale-aware formatting isn't something a money library can get right by
default, because it varies on every axis:

- **Symbol placement**: `$10.50` (`en-US`) vs. `10,50 €` (`fr-FR`) vs.
  `10.50 CHF` (`de-CH`).
- **Separators**: `,` as a decimal separator in French, as a thousands separator
  in English.
- **Preference**: some applications want `USD 10.50` for exports, others want
  `$10.50` for a checkout page, others want no symbol at all.

Baking any one of these in as a default would be wrong for everyone else, and
maintaining full CLDR-style locale data inside Moneta would massively expand its
scope for something the platform already does well.

## Formatting with Intl.NumberFormat

Both [`toDecimal`](/api/formatting/to-decimal) and
[`toUnits`](/api/formatting/to-units) accept an optional `transformer` function,
so you can pass the plain value straight to
[`Intl.NumberFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat)
or any formatting logic you need:

```ts
import { money, toDecimal, USD } from "jsr:@quarzo-life/moneta";

const m = money({ amount: 1050n, currency: USD });

toDecimal(
  m,
  ({ value, currency }) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.code,
    })
      .format(Number(value)),
); // "$10.50"
```

This puts the locale and display style in your hands, where it belongs —
Moneta's job stops at producing a correct, precision-safe value.
