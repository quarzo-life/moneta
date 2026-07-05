---
title: toSnapshot
description: Get a plain object snapshot of a Money object.
returns: "{ amount: bigint; currency: Currency; scale: number }"
---

# toSnapshot

Get a plain object snapshot of a Money object's `amount`, `currency`, and
`scale`.

Unlike `Money` itself, the returned object isn't frozen and has no `toJSON`
method. It's useful for inspecting or destructuring a `Money` object's
internals, but **it can't be used to store Money objects in a database or send
them over the network** — `amount` is still a `bigint`, which isn't
JSON-serializable. Use `JSON.stringify(monetaObject)` (backed by `Money.toJSON`)
and [`parse`](/api/conversions/parse) for that instead.

## Parameters

| Name           | Type    | Description                   | Required |
| -------------- | ------- | ----------------------------- | -------- |
| `monetaObject` | `Money` | The Money object to snapshot. | Yes      |

## Code examples

```ts
import { money, toSnapshot, USD } from "jsr:@quarzo-life/moneta";

const m = money({ amount: 1050n, currency: USD });

toSnapshot(m); // { amount: 1050n, currency: USD, scale: 2 }
```
