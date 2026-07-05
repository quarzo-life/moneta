---
title: Quick start
description: Learn how to get Moneta up and running in your project.
---

# Quick start

## Install the library

Moneta is published on [JSR](https://jsr.io/@quarzo-life/moneta). It's built for
Deno, but JSR's `add` command generates the right install for npm, yarn, pnpm,
and bun too:

```sh
# Deno
deno add jsr:@quarzo-life/moneta

# npm
npx jsr add @quarzo-life/moneta

# yarn
yarn dlx jsr add @quarzo-life/moneta

# pnpm
pnpm dlx jsr add @quarzo-life/moneta

# bun
bunx jsr add @quarzo-life/moneta
```

Then import it in your project. Everything is exported from a single entry point
— there's no separate subpath for currencies or a `bigint` variant, because
every amount is already a `bigint`:

```ts
import { add, EUR, money } from "jsr:@quarzo-life/moneta";
```

## First steps

Moneta lets you express monetary values safely in TypeScript. You can perform
mutations, conversions, comparisons, and formatting — all backed by exact
`bigint` arithmetic instead of floating-point `number`.

To get started, create a `Money` object with [`money()`](/api/money). Amounts
are specified as integers in the smallest subdivision of the currency (like
cents for the dollar):

```ts
import { EUR, money } from "jsr:@quarzo-life/moneta";

// This represents 5,00 EUR
const price = money({ amount: 500n, currency: EUR });
```

You can add or subtract by passing another `Money` object:

```ts
import { add, EUR, money, subtract } from "jsr:@quarzo-life/moneta";

const price = money({ amount: 500n, currency: EUR });

add(price, money({ amount: 100n, currency: EUR })); // a Money object with amount 600n
subtract(price, money({ amount: 100n, currency: EUR })); // a Money object with amount 400n
```

`Money` objects are immutable — every mutation returns a new object, and your
originals stay untouched:

```ts
price; // still a Money object with amount 500n
```

You can ask questions of your `Money` objects with the
[comparison functions](/core-concepts/comparisons):

```ts
import { equal, hasSubUnits, money, USD } from "jsr:@quarzo-life/moneta";

const first = money({ amount: 500n, currency: USD });
const second = money({ amount: 500n, currency: USD });

equal(first, second); // true
hasSubUnits(money({ amount: 1150n, currency: USD })); // true — has cents
```

And [format](/core-concepts/formatting) them for display:

```ts
import { money, toDecimal, USD } from "jsr:@quarzo-life/moneta";

const m = money({ amount: 5000n, currency: USD });

toDecimal(m); // "50.00"
toDecimal(m, ({ value, currency }) => `${currency.code} ${value}`); // "USD 50.00"
```

`Money` objects pick up their [scale](/core-concepts/scale) from the currency's
exponent, but you can specify one manually when you need more precision:

```ts
// This represents $5.000
const price = money({ amount: 5000n, currency: USD, scale: 3 });
```

This is only a preview — the rest of the documentation covers
[core concepts](/core-concepts/money), [guides](/guides/allocating-money) for
common scenarios, and the full [API reference](/api/money).
