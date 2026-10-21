---
title: convert
description: Convert a Money object to another currency using a market rate.
returns: Money
---

# convert

Convert a Money object to another currency using a market rate.

The rate must represent the target currency's value for 1 unit of the source
currency. For example, converting EUR to JPY might use a rate of
`{ amount: 1826818n, scale: 4 }` (182.6818 JPY per EUR).

If you need a fractional rate, don't use a float — use a scaled amount instead.
For example, instead of `0.89`, pass `{ amount: 89n, scale: 2 }`.

The result is rounded to the target currency's exponent with `divide`, which
defaults to [`halfUp`](/api/rounding/half-up). Pass another
[rounding strategy](/guides/danger-operations) when your conversion rules
require it.

Build the rate with [`fxRate`](/api/fx-rate) to validate it early and attach
traceability metadata (`context`); a plain `{ from, to, rate }` literal works
too. `fx.context` is ignored by the computation.

## Parameters

| Name          | Type              | Description                                            | Required |
| ------------- | ----------------- | ------------------------------------------------------ | -------- |
| `moneyObject` | `Money`           | The Money object to convert.                           | Yes      |
| `fx`          | `FXRate`          | The exchange rate, described below.                    | Yes      |
| `divide`      | `DivideOperation` | Rounding to the target exponent. Defaults to `halfUp`. | No       |

`FXRate` fields:

| Name      | Type                               | Description                                                             |
| --------- | ---------------------------------- | ----------------------------------------------------------------------- |
| `from`    | `Currency`                         | The source currency. Must match `moneyObject`'s currency.               |
| `to`      | `Currency`                         | The target currency.                                                    |
| `rate`    | `ScaledAmount \| number \| bigint` | The exchange rate, target units per one source unit. Strictly positive. |
| `context` | `FXRateContext`                    | Optional metadata, see [`fxRate`](/api/fx-rate). Ignored by `convert`.  |

## Throws

- If `moneyObject`'s currency doesn't match `fx.from`.
- If `fx.from` and `fx.to` use incompatible bases (e.g. converting between a
  decimal and a non-decimal currency).
- If `fx.rate` isn't strictly positive, is a non-integer `number` (pass a
  `ScaledAmount` for fractional rates instead), or has a scale that isn't a
  non-negative integer.

## Code examples

### Convert between two currencies

```ts
import { convert, EUR, money, USD } from "jsr:@quarzo-life/moneta";

const m = money({ amount: 1000n, currency: EUR }); // 10,00 EUR

convert(m, {
  from: EUR,
  to: USD,
  rate: { amount: 108n, scale: 2 }, // 1.08 USD per EUR
}); // a Money object with amount 1080 and currency USD
```

### Convert with an integer rate

```ts
import { convert, EUR, JPY, money } from "jsr:@quarzo-life/moneta";

const m = money({ amount: 1000n, currency: EUR }); // 10,00 EUR

convert(m, {
  from: EUR,
  to: JPY,
  rate: { amount: 1826818n, scale: 4 }, // 182.6818 JPY per EUR
}); // a Money object with currency JPY, rounded to JPY's exponent (0)
```

### Choose the rounding strategy

```ts
import { convert, EUR, fxRate, halfEven, money } from "jsr:@quarzo-life/moneta";

const fx = fxRate({ from: "EUR", to: "USD", rate: { amount: 11n, scale: 1 } });
const m = money({ amount: 115n, currency: EUR }); // 1,15 EUR → 1.265 USD

convert(m, fx); // amount 127 (halfUp, default)
convert(m, fx, halfEven); // amount 126
```
