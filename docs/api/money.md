---
title: money
description: Create a Money object.
returns: Money
---

# money

Create a `Money` object that represents a monetary value.

`money()` is the only sanctioned way to build a `Money` object — never construct
one as a plain literal. It validates its inputs (safe-integer and string-format
checks on `amount`, integer and non-negative checks on `scale`, currency code
resolution) and returns a frozen, immutable object.

You specify the amount in the currency's smallest subdivision (e.g. cents for
the US dollar) and pass a [currency](/core-concepts/currency), either as a
`Currency` object or as a known currency code string. The
[scale](/core-concepts/scale) defaults to the currency's exponent but can be set
manually for additional precision.

## Parameters

| Name       | Type                         | Description                                                                | Required |
| ---------- | ---------------------------- | -------------------------------------------------------------------------- | -------- |
| `amount`   | `number \| bigint \| string` | The amount in the smallest subdivision of the currency. Defaults to `0n`.  | No       |
| `currency` | `Currency \| CurrencyCode`   | A `Currency` object, or a known currency code (e.g. `"EUR"`).              | Yes      |
| `scale`    | `number`                     | The precision of the amount. Defaults to the currency's exponent (or `2`). | No       |

`amount` accepts three forms:

- `bigint` — used as-is, e.g. `500n`.
- `number` — must be a safe integer (`Number.isSafeInteger`); throws otherwise.
- `string` — must match `-?\d+` (an optional trailing `n` is stripped), e.g.
  `"500"` or `"500n"`.

## Throws

- If `currency` is a string that doesn't match a known
  [currency code](/api/currencies).
- If `scale` isn't a non-negative integer.
- If `amount` is a `number` that isn't a safe integer.
- If `amount` is a `string` that isn't a valid integer literal.

## Code examples

### Create a Money object

```ts
import { EUR, money } from "jsr:@quarzo-life/moneta";

// This represents 5,00 EUR
const m = money({ amount: 500n, currency: EUR });
```

### Create from a currency code

```ts
import { money } from "jsr:@quarzo-life/moneta";

const m = money({ amount: 500n, currency: "EUR" });
```

### Create with a custom scale

When you need more precision than the currency exponent provides, specify a
custom scale.

```ts
import { EUR, money } from "jsr:@quarzo-life/moneta";

// This represents 0,035 EUR (e.g. the price of a single screw)
const m = money({ amount: 35n, currency: EUR, scale: 3 });
```

### Create from a number or a string

```ts
import { EUR, money } from "jsr:@quarzo-life/moneta";

money({ amount: 500, currency: EUR }); // amount coerced from a safe-integer number
money({ amount: "500", currency: EUR }); // amount parsed from a string
money({ amount: "500n", currency: EUR }); // trailing "n" is accepted (round-trips with toJSON)
```

### Create with a non-decimal currency

Custom `Currency` objects can use an array `base` for non-decimal currencies.

```ts
import { money } from "jsr:@quarzo-life/moneta";
import type { Currency } from "jsr:@quarzo-life/moneta";

const preDecimalGBP: Currency = {
  code: "GBP",
  base: [20, 12],
  exponent: 1,
};

const m = money({ amount: 267n, currency: preDecimalGBP });
```

### Omit the amount

`amount` defaults to `0n`.

```ts
import { EUR, money, zeroMoney } from "jsr:@quarzo-life/moneta";

money({ currency: EUR }); // a Money object with amount 0n
zeroMoney(EUR); // equivalent shorthand
zeroMoney("EUR"); // also accepts a currency code
```
