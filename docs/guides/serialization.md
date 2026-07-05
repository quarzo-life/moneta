---
title: Serialization with bigint
description: How to store and transport Money objects, given that bigint isn't JSON-serializable.
---

# Serialization with bigint

`bigint` isn't natively supported by `JSON.stringify`/`JSON.parse` — calling
`JSON.stringify(10n)` throws a `TypeError`. Since every `Money` amount is a
`bigint`, storing or transporting a `Money` object needs a deliberate
serialization step.

## Round-tripping a Money object

`Money.toJSON()` is called implicitly by `JSON.stringify`. It serializes
`amount` as a string with a trailing `n` (e.g. `"500n"`) instead of a raw
number:

```ts
import { EUR, money } from "jsr:@quarzo-life/moneta";

const m = money({ amount: 500n, currency: EUR });

JSON.stringify(m); // '{"amount":"500n","currency":"EUR","scale":2}'
```

To rebuild a `Money` object from that string, use
[`parse`](/api/conversions/parse) — it reverses the `"n"` suffix and rebuilds
the object through `money()`, so the result is validated and frozen like any
other `Money` object:

```ts
import { parse } from "jsr:@quarzo-life/moneta";

const json = '{"amount":"500n","currency":"EUR","scale":2}';

const restored = parse(json);

restored.amount; // 500n
restored.currency.code; // "EUR"
```

This is the pattern to use for a database column (store the JSON string), an
HTTP payload, a message queue, or `localStorage`.

## Don't use toSnapshot for storage

[`toSnapshot`](/api/formatting/to-snapshot) returns a plain object with the same
fields, but it's **not** meant for storage or transport — `amount` is still a
raw `bigint`, so `JSON.stringify(toSnapshot(m))` throws the same way
stringifying a bare `bigint` would. Use it for inspection and debugging; use
`toJSON`/`parse` for anything that leaves the process.

## Serializing your own bigint fields

If you're storing `bigint` values alongside `Money` objects in your own data
structures (a running total, a ledger entry ID), reuse the same convention with
[`bigIntReplacer`/`bigIntReviver`](/api/helpers/json-bigint):

```ts
import { bigIntReplacer, bigIntReviver } from "jsr:@quarzo-life/moneta";

const entry = { total: 1050n, label: "invoice-042" };

const json = JSON.stringify(entry, bigIntReplacer); // '{"total":"1050n","label":"invoice-042"}'

const restored = JSON.parse(json, bigIntReviver);

restored.total; // 1050n
```

Keeping the same `"<n>n"` convention everywhere means you can nest `Money`
objects inside larger structures and serialize the whole thing with a single
`JSON.stringify(data, bigIntReplacer)` call.
