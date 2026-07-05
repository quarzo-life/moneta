---
title: Cryptocurrency support
description: How to create Money objects for cryptocurrencies like Bitcoin and Ethereum.
---

# Cryptocurrency support

Moneta works with cryptocurrencies like any other currency — you just describe
them with the `Currency` shape and pass them to `money()`. There's no special
mode to opt into, because [every amount is already a `bigint`](/faq/why-bigint):
the safe-integer ceiling that trips up `number`-based money libraries with
high-exponent currencies doesn't apply here.

Cryptocurrencies typically have much higher exponents than everyday fiat
currencies — Bitcoin uses 8 decimal places (satoshis), Ethereum uses 18 (wei).
Both exceed what `Number` can represent exactly once amounts get large, but are
exact in `bigint`:

```ts
import { add, money, toDecimal } from "jsr:@quarzo-life/moneta";
import type { Currency } from "jsr:@quarzo-life/moneta";

const BTC: Currency = { code: "BTC", base: 10, exponent: 8 };
const ETH: Currency = { code: "ETH", base: 10, exponent: 18 };

const btc = money({ amount: 123456789n, currency: BTC }); // 1.23456789 BTC
toDecimal(btc); // "1.23456789"

const oneEth = money({ amount: 1_000_000_000_000_000_000n, currency: ETH }); // 1 ETH in wei
toDecimal(oneEth); // "1.000000000000000000"

// Amounts well beyond Number.MAX_SAFE_INTEGER stay exact
const largeWei = money({
  amount: 123456789012345678901234567890n,
  currency: ETH,
});
add(largeWei, oneEth).amount; // exact bigint sum, no precision loss
```

[`allocate`](/api/mutations/allocate) also works as expected for splitting a
crypto payment across recipients without losing a single satoshi or wei to
rounding.

Moneta doesn't ship built-in currency objects for cryptocurrencies — there's no
`BTC` or `ETH` export alongside `USD` or `EUR` in
[the currency registry](/api/currencies). Their codes, decimal conventions, and
even existence are far less stable than ISO 4217 fiat currencies, so it's left
to you to define the ones you need, the same way you would for
[a custom fiat currency](/guides/adding-a-currency).

**See also:** [Why bigint?](/faq/why-bigint)
