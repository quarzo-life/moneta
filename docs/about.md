---
title: About
description: Moneta is an open-source monetary library by Quarzo Life, forked from Dinero.js v2.
---

# About

Moneta is an open-source library maintained by
[Quarzo Life](https://github.com/quarzo-life) and
[contributors](https://github.com/quarzo-life/moneta/graphs/contributors).

It started as a fork of [Dinero.js v2](https://v2.dinerojs.com/), rewritten so
every amount is a native [`bigint`](/faq/why-bigint) — no `number`-based
arithmetic anywhere — and built for [Deno](https://deno.com), distributed via
[JSR](https://jsr.io/@quarzo-life/moneta).

It's licensed under
[MIT](https://github.com/quarzo-life/moneta/blob/main/LICENSE.md).

## Acknowledgements

Like Dinero.js, Moneta is based on
[Martin Fowler's money pattern](https://martinfowler.com/eaaCatalog/money.html)
— representing a monetary value as an amount paired with a currency, instead of
a bare number.

Moneta owes its API shape, and much of its documentation structure, to
[Dinero.js](https://v2.dinerojs.com/).
[Money PHP](https://www.moneyphp.org/en/stable/) is another implementation of
the same pattern worth knowing about if you work across languages.
