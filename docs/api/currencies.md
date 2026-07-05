---
title: Currencies
description: Built-in Currency objects.
returns: Currency
---

# Currencies

A `Currency` is a plain object describing a currency's code, base (radix), and
exponent:

```ts
type Currency = {
  readonly code: string;
  readonly base: number | readonly number[];
  readonly exponent: number;
};
```

- `code` — a unique identifier for the currency (not necessarily ISO 4217).
- `base` — the radix used to convert between scales. Almost always `10` for
  decimal currencies. Rarely, a currency subdivides non-decimally — pre-decimal
  Great Britain pound sterling used `20` shillings per pound and `12` pence per
  shilling, expressed as `base: [20, 12]`.
- `exponent` — the number of digits after the decimal point in the currency's
  conventional (smallest human-facing) unit, e.g. `2` for `5,00 EUR`, `0` for
  `¥500`.

`money()` accepts either a `Currency` object or a known currency code string
(resolved through the `CURRENCIES` registry).

## Built-in currencies

| Export | `code` | `base` | `exponent` |
| ------ | ------ | ------ | ---------- |
| `USD`  | `USD`  | `10`   | `2`        |
| `EUR`  | `EUR`  | `10`   | `2`        |
| `GBP`  | `GBP`  | `10`   | `2`        |
| `CHF`  | `CFH`  | `10`   | `2`        |
| `JPY`  | `JPY`  | `10`   | `0`        |
| `MKD`  | `MKD`  | `10`   | `0`        |
| `MGA`  | `MGA`  | `5`    | `1`        |

`MGA` (Malagasy ariary) is included mainly for testing: it's one of the few
real-world currencies with a non-decimal `base` (5 iraimbilanja per ariary).

## Code examples

### Use a built-in currency object

```ts
import { money, USD } from "jsr:@quarzo-life/moneta";

const m = money({ amount: 500n, currency: USD });
```

### Use a currency code string

```ts
import { money } from "jsr:@quarzo-life/moneta";

const m = money({ amount: 500n, currency: "USD" });
```

### Look up a currency by code

```ts
import { CURRENCIES } from "jsr:@quarzo-life/moneta";
import type { CurrencyCode } from "jsr:@quarzo-life/moneta";

const code: CurrencyCode = "EUR";
const currency = CURRENCIES[code]; // the EUR Currency object
```

### Define a custom currency

Any object matching the `Currency` shape works — you don't need to register it
anywhere.

```ts
import { money } from "jsr:@quarzo-life/moneta";
import type { Currency } from "jsr:@quarzo-life/moneta";

const BTC: Currency = {
  code: "BTC",
  base: 10,
  exponent: 8, // satoshis
};

const m = money({ amount: 100_000_000n, currency: BTC }); // 1 BTC
```

See the [Cryptocurrency support](/guides/cryptocurrencies) guide for more on
working with high-exponent currencies like BTC and ETH.
