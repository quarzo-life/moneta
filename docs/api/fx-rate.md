---
title: fxRate
description: Create an FXRate object.
returns: FXRate
---

# fxRate

Create an `FXRate` object: 1 unit of `from` equals `rate` units of `to`.

`fxRate()` validates its inputs and returns a frozen object whose `rate` is
normalized to a scaled amount (`{ amount: bigint, scale: number }`). A plain
`{ from, to, rate }` literal is still accepted by
[`convert`](/api/conversions/convert), but `fxRate()` fails early on invalid
data and resolves currency codes.

Only `from`, `to` and `rate` take part in computations. The optional `context`
carries metadata for traceability (where the rate comes from, when it was
quoted, how long it can be used) and is never read by `convert`.

## Parameters

| Name      | Type                               | Description                                                      | Required |
| --------- | ---------------------------------- | ---------------------------------------------------------------- | -------- |
| `from`    | `Currency \| CurrencyCode`         | The source currency, or a known currency code (e.g. `"EUR"`).    | Yes      |
| `to`      | `Currency \| CurrencyCode`         | The target currency, or a known currency code.                   | Yes      |
| `rate`    | `ScaledAmount \| number \| bigint` | Units of `to` for 1 unit of `from`. Must be strictly positive.   | Yes      |
| `context` | `FXRateContext`                    | Optional metadata, described below. Every field is optional too. | No       |

`FXRateContext` fields:

| Name          | Type                | Description                                                                  |
| ------------- | ------------------- | ---------------------------------------------------------------------------- |
| `id`          | `string`            | Identifier of the quote at its source, to find it back later.                |
| `source`      | `string`            | Provider of the rate (e.g. `"ECB"`, a broker name).                          |
| `kind`        | `RateKind`          | `"reference"`, `"indicative"`, `"executable"`, or any custom string.         |
| `quotedAt`    | `string`            | When the rate was quoted (ISO 8601).                                         |
| `validFrom`   | `string`            | Start of the validity window, inclusive (ISO 8601).                          |
| `validUntil`  | `string`            | End of the validity window, exclusive (ISO 8601).                            |
| `derivedFrom` | `readonly FXRate[]` | Rates a cross rate was computed from (e.g. EUR→USD and USD→JPY for EUR→JPY). |

Dates are ISO 8601 strings: either a calendar date (`2026-10-21`, e.g. a daily
reference rate) or a date-time with an offset (`2026-10-21T14:03:12Z`,
`2026-10-21T16:03:12+02:00`, e.g. a broker quote). Date-times without an offset
are rejected because they would depend on the local time zone.

## Throws

- If `from` or `to` is a string that doesn't match a known
  [currency code](/api/currencies).
- If `from` and `to` use incompatible bases.
- If `rate` isn't strictly positive, is a non-integer `number`, or has a scale
  that isn't a non-negative integer.
- If a context date isn't a valid ISO 8601 date or date-time with offset.
- If `validFrom` isn't strictly before `validUntil`.

## Code examples

### Create a rate

```ts
import { fxRate } from "jsr:@quarzo-life/moneta";

const fx = fxRate({
  from: "EUR",
  to: "USD",
  rate: { amount: 10823n, scale: 4 }, // 1 EUR = 1.0823 USD
});
```

### Add traceability metadata

```ts
import { fxRate } from "jsr:@quarzo-life/moneta";

const fx = fxRate({
  from: "EUR",
  to: "USD",
  rate: { amount: 10823n, scale: 4 },
  context: {
    id: "ecb-2026-10-21-usd",
    source: "ECB",
    kind: "reference",
    quotedAt: "2026-10-21",
  },
});
```

### Time-limited quote

```ts
import { fxRate } from "jsr:@quarzo-life/moneta";

const quote = fxRate({
  from: "EUR",
  to: "USD",
  rate: { amount: 10819n, scale: 4 },
  context: {
    id: "Q-883421",
    source: "broker",
    kind: "executable",
    quotedAt: "2026-10-21T14:03:12Z",
    validFrom: "2026-10-21T14:03:12Z",
    validUntil: "2026-10-21T14:03:42Z", // 30 seconds
  },
});
```
