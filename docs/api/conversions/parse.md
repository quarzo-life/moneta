---
title: parse
description: Parse a JSON string back into a Money object.
returns: Money
---

# parse

Parse a JSON string produced by `JSON.stringify(money)` back into a `Money`
object.

`Money.toJSON()` serializes `amount` as a string with a trailing `n` (e.g.
`"500n"`) because `bigint` isn't JSON-serializable. `parse` reverses that: it
uses [`bigIntReviver`](/api/helpers/json-bigint) to restore the `bigint`, then
rebuilds the object through [`money()`](/api/money) — so the result is validated
and frozen like any other `Money` object.

## Parameters

| Name   | Type     | Description                                   | Required |
| ------ | -------- | --------------------------------------------- | -------- |
| `text` | `string` | A Money object previously serialized to JSON. | Yes      |

## Code examples

### Round-trip a Money object through JSON

```ts
import { EUR, money, parse } from "jsr:@quarzo-life/moneta";

const original = money({ amount: 500n, currency: EUR });

const json = JSON.stringify(original); // '{"amount":"500n","currency":"EUR","scale":2}'

const restored = parse(json);

restored.amount; // 500n
restored.currency.code; // "EUR"
```
