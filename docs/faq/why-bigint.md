---
title: Why bigint?
description: Why every Money amount is a bigint instead of a number.
---

# Why bigint?

Every `Money` amount is a `bigint`, with no `number`-based arithmetic anywhere
in the library. This is a deliberate constraint, not an oversight — earlier
iterations of the project (it started as a fork of Dinero.js v2) supported plain
`number` amounts, and that's exactly what motivated the rewrite.

`number` has two properties that make it a poor fit for money:

- **Floating-point rounding errors.** `0.1 + 0.2 !== 0.3` in IEEE 754
  double-precision floats. Money math that touches decimals this way accumulates
  errors silently.
- **A safe-integer ceiling.** `Number` can only represent integers exactly up to
  `Number.MAX_SAFE_INTEGER` (2^53 - 1). Large invoices, aggregated ledgers, or
  currencies with many decimal places (some cryptocurrencies use 18) can exceed
  that ceiling — and once they do, arithmetic silently loses precision instead
  of throwing. See the [Cryptocurrency support](/guides/cryptocurrencies) guide
  for a worked example.

`bigint` has neither problem: it's an arbitrary-precision integer type, so
amounts stay exact regardless of magnitude — as long as the whole pipeline
(yours included) also does integer math on the smallest subdivision, never
floats.

## What this means in practice

`money()` still accepts `number` and `string` for convenience, but always
normalizes to `bigint` internally:

```ts
import { EUR, money } from "jsr:@quarzo-life/moneta";

money({ amount: 500n, currency: EUR }); // bigint, used as-is
money({ amount: 500, currency: EUR }); // number, converted to 500n
money({ amount: "500", currency: EUR }); // string, parsed to 500n
```

The `number` path isn't a silent escape hatch, though — `money()` checks
`Number.isSafeInteger(amount)` and throws rather than accept a value that
already lost precision before it got here:

```ts
money({ amount: 2 ** 53, currency: EUR }); // throws: not a safe integer
money({ amount: BigInt(2 ** 53), currency: EUR }); // fine — bigint has no ceiling
```

## Trade-offs

Working exclusively in `bigint` has real costs, and it's worth knowing them
upfront:

- **Literals are more verbose.** You write `500n`, not `500`.
- **You can't mix `bigint` and `number` in arithmetic.** `10n + 2` throws a
  `TypeError` — this is a JavaScript language rule, not a Moneta one. All of
  Moneta's own math stays within `bigint`, so this only bites you if you reach
  into a `Money` object's `amount` and mix it with plain numbers yourself.
- **`bigint` isn't JSON-serializable.** `JSON.stringify` throws on a raw
  `bigint`. `Money.toJSON()` works around this by serializing `amount` as a
  string with a trailing `n` (e.g. `"500n"`); use
  [`parse`](/api/conversions/parse) or the
  [JSON bigint helpers](/api/helpers/json-bigint) to round-trip it. See the
  [Serialization guide](/guides/serialization) for details.
