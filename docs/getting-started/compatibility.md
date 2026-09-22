---
title: Compatibility
description: Understand which runtimes and JavaScript engines Moneta supports.
---

# Compatibility

## Runtime

Moneta is built for [Deno](https://deno.com) and published on
[JSR](https://jsr.io/@quarzo-life/moneta), Deno's package registry. It's tested
and developed against the current stable Deno release.

JSR packages can also be consumed from Node.js, Bun, and browsers-via-bundler,
through `jsr add` (see
[Quick start](/getting-started/quick-start#install-the-library)). This generates
a compatibility shim, so Moneta works the same way whether you install it with
`deno add`, `npm`, `yarn`, `pnpm`, or `bun`.

## Module format

Moneta ships **ESM only.** Use `import`, not `require()`. This follows Deno's
and JSR's conventions — there's no CommonJS build.

## bigint support

Every `Money` amount is a native [`bigint`](/faq/why-bigint), so Moneta requires
a JavaScript engine with `bigint` support:

- Node.js 10.4+
- All evergreen browsers (Chrome, Edge, Firefox, Safari) for several years
- Deno and Bun, in every version

::: warning `bigint` is a JavaScript primitive type, not a library feature it
can't be polyfilled. If you need to support an environment without native
`bigint`, Moneta isn't a fit; see [Why bigint?](/faq/why-bigint) for why the
library doesn't offer a `number`-based fallback. :::
